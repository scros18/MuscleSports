'use client';

import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin-layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GripVertical, 
  Eye, 
  EyeOff, 
  Save, 
  RotateCcw,
  Layout,
  Grid3x3,
  ShoppingCart,
  Star,
  Package,
  Users,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';

interface SectionItem {
  id: string;
  type: string;
  enabled: boolean;
  order: number;
  title: string;
  description: string;
  settings?: any;
  position?: string;
  sticky?: boolean;
}

interface PageLayout {
  sections: SectionItem[];
}

interface SiteLayout {
  homepage: PageLayout;
  products: PageLayout;
  checkout: PageLayout;
}

const SECTION_ICONS: { [key: string]: any } = {
  hero: Layout,
  panels: Grid3x3,
  products: Package,
  reviews: Star,
  partners: Users,
  filters: Grid3x3,
  grid: Grid3x3,
  form: ShoppingCart,
  summary: ShoppingCart,
  image: ImageIcon
};

export default function LayoutBuilderPage() {
  const [activeTab, setActiveTab] = useState<'homepage' | 'products' | 'checkout'>('homepage');
  const [layout, setLayout] = useState<SiteLayout | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [draggedItem, setDraggedItem] = useState<SectionItem | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  // Load layout on mount
  useEffect(() => {
    loadLayout();
  }, []);

  const loadLayout = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/site-layout?businessId=default', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLayout(data.layout);
      } else {
        console.error('Failed to load layout:', response.status, response.statusText);
        alert('⚠️ Failed to load layout. Please make sure you are logged in as admin.');
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('⚠️ Error loading layout. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    if (!layout) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      
      console.log('🔍 Debug Info:');
      console.log('Token exists:', !!token);
      console.log('Token length:', token?.length);
      console.log('Token preview:', token?.substring(0, 20) + '...');
      
      if (!token) {
        alert('⚠️ Authentication token not found. Please log in again.');
        setSaving(false);
        return;
      }

      console.log('Sending POST request to /api/site-layout');
      const response = await fetch('/api/site-layout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          businessId: 'default',
          layout
        })
      });

      console.log('Response status:', response.status);
      console.log('Response OK:', response.ok);

      if (response.ok) {
        alert('✅ Layout saved! Changes are now live on your site.');
      } else if (response.status === 401) {
        const errorData = await response.json();
        console.error('401 Error details:', errorData);
        alert('⚠️ Unauthorized. Please log in as admin and try again.\n\nTip: Try logging out and logging back in.');
      } else {
        const errorText = await response.text();
        console.error('Save failed:', errorText);
        alert('❌ Failed to save layout: ' + response.statusText);
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('❌ Error saving layout: ' + (error as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const resetLayout = async () => {
    if (!confirm('⚠️ Reset to default layout? This cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        alert('⚠️ Authentication token not found. Please log in again.');
        return;
      }

      const response = await fetch('/api/site-layout?businessId=default', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await loadLayout();
        alert('✅ Layout reset to defaults');
      } else if (response.status === 401) {
        alert('⚠️ Unauthorized. Please log in as admin and try again.');
      } else {
        alert('❌ Failed to reset layout');
      }
    } catch (error) {
      console.error('Error resetting layout:', error);
      alert('❌ Error resetting layout');
    }
  };

  const toggleSection = (sectionId: string) => {
    if (!layout) return;

    const updatedLayout = { ...layout };
    const page = updatedLayout[activeTab];
    const section = page.sections.find(s => s.id === sectionId);
    
    if (section) {
      section.enabled = !section.enabled;
      setLayout(updatedLayout);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: SectionItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (!draggedItem || !layout) return;

    const updatedLayout = { ...layout };
    const page = updatedLayout[activeTab];
    const sections = [...page.sections];
    
    const dragIndex = sections.findIndex(s => s.id === draggedItem.id);
    
    if (dragIndex === -1) return;

    // Remove from old position
    const [removed] = sections.splice(dragIndex, 1);
    
    // Insert at new position
    sections.splice(dropIndex, 0, removed);
    
    // Update order property
    sections.forEach((section, idx) => {
      section.order = idx;
    });

    page.sections = sections;
    setLayout(updatedLayout);
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
    setDraggedItem(null);
    setDragOverIndex(null);
  };

  if (loading) {
    return (
      <AdminLayout title="Layout Builder" description="Customize your site layout">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading layout builder...</div>
        </div>
      </AdminLayout>
    );
  }

  if (!layout) {
    return (
      <AdminLayout title="Layout Builder" description="Customize your site layout">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-600">Failed to load layout</div>
        </div>
      </AdminLayout>
    );
  }

  const currentPage = layout[activeTab];

  return (
    <AdminLayout title="Layout Builder" description="Drag & drop site layout editor">
      <div className="p-6 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
              <Grid3x3 className="h-8 w-8 text-primary" />
              Layout Builder
            </h1>
            <p className="text-muted-foreground">
              Drag sections to reorder • Click eye icon to show/hide • Changes apply to all visitors
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={resetLayout} 
              variant="outline"
              disabled={saving}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveLayout} 
              disabled={saving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="flex gap-2 mb-6 border-b border-border">
          {['homepage', 'products', 'checkout'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-3 font-medium transition-all capitalize ${
                activeTab === tab
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Instructions Card */}
        <Card className="p-4 mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-blue-900 dark:text-blue-100">
                📱 iOS-Style Layout Editor
              </h3>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 pl-4">
                <li className="list-disc"><strong>Drag & Drop:</strong> Hold the grip icon (⋮⋮) and drag sections up/down</li>
                <li className="list-disc"><strong>Show/Hide:</strong> Click the eye icon to toggle section visibility</li>
                <li className="list-disc"><strong>Order Numbers:</strong> Each section shows its position (1, 2, 3...)</li>
                <li className="list-disc"><strong>Live Changes:</strong> Your layout affects all site visitors after saving</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Section List */}
        <div className="space-y-3">
          {currentPage.sections.map((section, index) => {
            const Icon = SECTION_ICONS[section.type] || Layout;
            const isDragging = draggedItem?.id === section.id;
            const isDropTarget = dragOverIndex === index;

            return (
              <div
                key={section.id}
                draggable
                onDragStart={(e) => handleDragStart(e, section)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`
                  transition-all duration-200 transform
                  ${isDragging ? 'scale-95' : 'scale-100'}
                  ${isDropTarget ? 'ring-4 ring-primary/50 ring-offset-2 scale-105' : ''}
                `}
              >
                <Card 
                  className={`
                    p-4 cursor-move hover:shadow-xl transition-all duration-200
                    ${!section.enabled ? 'opacity-50 bg-muted/50' : 'hover:border-primary/50'}
                    ${isDragging ? 'shadow-2xl border-primary' : ''}
                  `}
                >
                  <div className="flex items-center gap-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0 cursor-grab active:cursor-grabbing">
                      <GripVertical className="h-7 w-7 text-muted-foreground hover:text-primary transition-colors" />
                    </div>

                    {/* Order Badge */}
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-md">
                      <span className="text-lg font-bold text-white">{index + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>

                    {/* Section Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-lg mb-1">{section.title}</h3>
                      <p className="text-sm text-muted-foreground truncate">
                        {section.description}
                      </p>
                    </div>

                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {section.settings && (
                        <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-xs font-semibold text-blue-700 dark:text-blue-300">
                          Customized
                        </div>
                      )}
                      {section.position && (
                        <div className="px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900 text-xs font-semibold text-purple-700 dark:text-purple-300 capitalize">
                          {section.position}
                        </div>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <Button
                      onClick={() => toggleSection(section.id)}
                      variant={section.enabled ? "default" : "outline"}
                      size="lg"
                      className="flex-shrink-0 min-w-[120px]"
                    >
                      {section.enabled ? (
                        <>
                          <Eye className="h-5 w-5 mr-2" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-5 w-5 mr-2" />
                          Hidden
                        </>
                      )}
                    </Button>
                  </div>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Stats Footer */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-muted to-muted/50">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{currentPage.sections.length}</div>
                <div className="text-sm text-muted-foreground mt-1">Total Sections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {currentPage.sections.filter(s => s.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Visible</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {currentPage.sections.filter(s => !s.enabled).length}
                </div>
                <div className="text-sm text-muted-foreground mt-1">Hidden</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saving ? (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="font-medium">Saving changes...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse"></div>
                  <span className="font-medium">All changes saved</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>💡 Tip: Changes won't apply until you click "Save Layout"</p>
        </div>
      </div>
    </AdminLayout>
  );
}
