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
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveLayout = async () => {
    if (!layout) return;

    try {
      setSaving(true);
      const token = localStorage.getItem('auth_token');
      
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

      if (response.ok) {
        try {
          const updated = await response.json();
          if (updated?.layout) {
            setLayout(updated.layout);
          }
        } catch (e) {}

        try {
          localStorage.setItem('siteLayoutUpdatedAt', String(Date.now()));
        } catch (e) {}

        try {
          const bc = new BroadcastChannel('site-layout');
          bc.postMessage({ type: 'updated', at: Date.now() });
          bc.close();
        } catch (e) {}

        alert('✅ Layout saved successfully!');
      } else {
        alert('❌ Failed to save layout');
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('❌ Error saving layout');
    } finally {
      setSaving(false);
    }
  };

  const resetLayout = async () => {
    if (!confirm('Reset to default layout? This cannot be undone.')) return;
    
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/site-layout?businessId=default', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        await loadLayout();
        alert('✅ Layout reset to defaults');
      }
    } catch (error) {
      console.error('Error resetting layout:', error);
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

    const [removed] = sections.splice(dragIndex, 1);
    sections.splice(dropIndex, 0, removed);
    
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!layout) {
    return (
      <AdminLayout title="Layout Builder" description="Customize your site layout">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-red-500">Failed to load layout</div>
        </div>
      </AdminLayout>
    );
  }

  const currentPage = layout[activeTab];

  return (
    <AdminLayout title="Layout Builder" description="Drag & drop site layout editor">
      <div className="p-4 md:p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-2 md:p-3 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl shadow-lg">
              <Grid3x3 className="h-5 md:h-7 w-5 md:w-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">Layout Builder</h2>
              <p className="text-xs md:text-sm text-slate-400">Drag sections to reorder • Click eye icon to toggle</p>
            </div>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button 
              onClick={resetLayout} 
              disabled={saving}
              className="flex-1 md:flex-none bg-slate-800 hover:bg-slate-700 text-white rounded-full border border-slate-700 font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
            >
              <RotateCcw className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
              Reset
            </Button>
            <Button 
              onClick={saveLayout} 
              disabled={saving}
              className="flex-1 md:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all text-sm md:text-base"
            >
              <Save className="h-3 md:h-4 w-3 md:w-4 mr-1 md:mr-2" />
              {saving ? 'Saving...' : 'Save Layout'}
            </Button>
          </div>
        </div>

        {/* Page Tabs */}
        <div className="flex gap-1 md:gap-2 mb-6 bg-slate-900 rounded-xl p-1 border border-slate-800 overflow-x-auto">
          {['homepage', 'products', 'checkout'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 px-3 md:px-6 py-2 md:py-3 font-semibold rounded-lg transition-all capitalize text-sm md:text-base whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Instructions Card */}
        <Card className="p-3 md:p-5 mb-6 bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-500/30">
          <div className="flex items-start gap-2 md:gap-3">
            <AlertCircle className="h-4 md:h-5 w-4 md:w-5 text-blue-400 mt-0.5 flex-shrink-0" />
            <div className="space-y-2">
              <h3 className="font-bold text-sm md:text-base text-blue-300">Layout Editor Instructions</h3>
              <ul className="text-xs md:text-sm text-slate-300 space-y-0.5 md:space-y-1 pl-4">
                <li className="list-disc"><strong>Drag & Drop:</strong> Hold grip icon and drag sections up/down</li>
                <li className="list-disc"><strong>Show/Hide:</strong> Click eye icon to toggle visibility</li>
                <li className="list-disc"><strong>Order Numbers:</strong> Each section shows its position</li>
                <li className="list-disc"><strong>Live Changes:</strong> Layout affects all visitors after saving</li>
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
                className={`transition-all duration-200 transform ${isDragging ? 'scale-95' : 'scale-100'} ${isDropTarget ? 'ring-4 ring-blue-500/50 ring-offset-2 scale-105' : ''}`}
              >
                <Card 
                  className={`p-3 md:p-4 cursor-move bg-slate-900 border-slate-800 hover:border-blue-500/50 transition-all duration-200 ${!section.enabled ? 'opacity-50' : ''} ${isDragging ? 'shadow-2xl border-blue-500' : 'hover:shadow-xl'}`}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-4">
                    {/* Drag Handle */}
                    <div className="flex-shrink-0 cursor-grab active:cursor-grabbing hidden md:block">
                      <GripVertical className="h-6 md:h-7 w-6 md:w-7 text-slate-400 hover:text-blue-400 transition-colors" />
                    </div>

                    {/* Order Badge */}
                    <div className="flex-shrink-0 w-8 md:w-10 h-8 md:h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
                      <span className="text-sm md:text-lg font-bold text-white">{index + 1}</span>
                    </div>

                    {/* Icon */}
                    <div className="flex-shrink-0 p-2 rounded-lg bg-blue-500/20">
                      <Icon className="h-5 md:h-6 w-5 md:w-6 text-blue-400" />
                    </div>

                    {/* Section Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-base md:text-lg text-white mb-0.5 md:mb-1">{section.title}</h3>
                      <p className="text-xs md:text-sm text-slate-400 truncate">{section.description}</p>
                    </div>

                    {/* Badges - Hidden on mobile to save space */}
                    <div className="hidden md:flex items-center gap-2 flex-shrink-0">
                      {section.settings && (
                        <div className="px-3 py-1 rounded-full bg-blue-500/20 text-xs font-semibold text-blue-400 border border-blue-500/30">
                          Customized
                        </div>
                      )}
                      {section.position && (
                        <div className="px-3 py-1 rounded-full bg-cyan-500/20 text-xs font-semibold text-cyan-400 border border-cyan-500/30 capitalize">
                          {section.position}
                        </div>
                      )}
                    </div>

                    {/* Toggle Button */}
                    <Button
                      onClick={() => toggleSection(section.id)}
                      className={`flex-shrink-0 w-full md:w-auto px-3 md:px-4 py-1.5 md:py-2 rounded-full font-semibold text-sm md:text-base shadow-lg hover:shadow-xl transition-all ${
                        section.enabled 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white' 
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700'
                      }`}
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
        <Card className="mt-8 p-6 bg-slate-900 border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{currentPage.sections.length}</div>
                <div className="text-sm text-slate-400 mt-1">Total Sections</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">{currentPage.sections.filter(s => s.enabled).length}</div>
                <div className="text-sm text-slate-400 mt-1">Visible</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{currentPage.sections.filter(s => !s.enabled).length}</div>
                <div className="text-sm text-slate-400 mt-1">Hidden</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {saving ? (
                <div className="flex items-center gap-2 text-blue-400">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
                  <span className="font-medium">Saving changes...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-green-400">
                  <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse"></div>
                  <span className="font-medium">Ready to save</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Help Text */}
        <div className="mt-6 text-center text-sm text-slate-400">
          <p>💡 Tip: Changes won&apos;t apply until you click &quot;Save Layout&quot;</p>
        </div>
      </div>
    </AdminLayout>
  );
}
