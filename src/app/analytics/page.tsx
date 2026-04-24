"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "@/layouts/AppLayout";
import { snippetService, folderService, tagService, Snippet, Folder, Tag } from "@/lib/firebaseServices";
import {
  FiBarChart,
  FiTrendingUp,
  FiCode,
  FiFolder,
  FiTag,
  FiStar,
  FiClock,
  FiActivity,
  FiTarget,
  FiZap,
  FiEye,
  FiDownload,
  FiHeart
} from "react-icons/fi";
import { useError } from "@/contexts/ErrorContext";

function timestampToDate(timestamp: any): Date {
  if (!timestamp) return new Date(0);
  if (typeof timestamp === 'object' && typeof timestamp.toDate === 'function') {
    return timestamp.toDate();
  }
  return new Date(timestamp);
}

export default function Analytics() {
  const { user } = useAuth();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const { showError } = useError();

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user, timeRange]);

  const loadData = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const [snippetsData, foldersData, tagsData] = await Promise.all([
        snippetService.getByUser(user.id),
        folderService.getByUser(user.id),
        tagService.getByUser(user.id)
      ]);
      
      setSnippets(snippetsData);
      setFolders(foldersData);
      setTags(tagsData);
      console.log('Snippets:', snippetsData);
      console.log('Folders:', foldersData);
      console.log('Tags:', tagsData);
    } catch (error) {
      console.error('Error loading analytics data:', error);
      showError('Error loading analytics data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate analytics data
  const getAnalyticsData = () => {
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };
    const snippetsToShow = snippets.filter(snippet => {
      if (!snippet.createdAt) return false;
      const createdAt = timestampToDate(snippet.createdAt);
      return now.getTime() - createdAt.getTime() <= timeRangeMs[timeRange];
    });

    // Category distribution
    const categoryStats = snippetsToShow.reduce((acc, snippet) => {
      const category = snippet.category || 'Uncategorized';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tag usage
    const tagStats = snippetsToShow.reduce((acc, snippet) => {
      snippet.tags.forEach(tag => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Activity over time
    const activityData = snippetsToShow.reduce((acc, snippet) => {
      if (!snippet.createdAt) return acc;
      const date = timestampToDate(snippet.createdAt);
      const dateStr = date.toISOString().split('T')[0];
      acc[dateStr] = (acc[dateStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Folder usage
    const folderStats = snippetsToShow.reduce((acc, snippet) => {
      const folderId = snippet.folderId || 'No Folder';
      acc[folderId] = (acc[folderId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalSnippets: snippetsToShow.length,
      totalFolders: folders.length,
      totalTags: tags.length,
      likedSnippets: snippetsToShow.filter(s => s.favorite).length,
      publicSnippets: snippetsToShow.filter(s => s.isPublic).length,
      categoryStats,
      tagStats,
      activityData,
      folderStats,
      averageSnippetsPerDay: snippetsToShow.length / (timeRangeMs[timeRange] / (24 * 60 * 60 * 1000)),
      mostUsedCategory: Object.entries(categoryStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None',
      mostUsedTag: Object.entries(tagStats).sort(([,a], [,b]) => b - a)[0]?.[0] || 'None'
    };
  };

  const analytics = getAnalyticsData();

  const getTopCategories = () => {
    return Object.entries(analytics.categoryStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([category, count]) => ({ category, count }));
  };

  const getTopTags = () => {
    return Object.entries(analytics.tagStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([tag, count]) => ({ tag, count }));
  };

  const getActivityChartData = () => {
    const dates = Object.keys(analytics.activityData).sort();
    return dates.map(date => ({
      date,
      count: analytics.activityData[date]
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        {/* Hero Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative px-6 py-16 sm:px-8 sm:py-20">
            <div className="mx-auto max-w-7xl">
              <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                  Analytics
                </h1>
                <p className="mt-6 text-xl text-blue-100 max-w-3xl mx-auto">
                  Deep insights into your snippet usage and productivity patterns. Track your progress and optimize your workflow.
                </p>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div className="px-6 py-8 sm:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Your Analytics
                </h2>
                <p className="text-gray-600 mt-1">
                  Insights into your snippet usage and productivity patterns
                </p>
              </div>
              <div className="flex items-center gap-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as any)}
                  className="px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="text-center">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading analytics...</p>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">Total Snippets</p>
                        <p className="text-3xl font-bold text-blue-900">{analytics.totalSnippets}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Created in {timeRange}
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiCode className="h-7 w-7 text-blue-600" />
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">Folders Created</p>
                        <p className="text-3xl font-bold text-green-900">{analytics.totalFolders}</p>
                        <p className="text-xs text-green-600 mt-1">
                          Organization tools
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-green-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiFolder className="h-7 w-7 text-green-600" />
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-purple-600">Tags Used</p>
                        <p className="text-3xl font-bold text-purple-900">{analytics.totalTags}</p>
                        <p className="text-xs text-purple-600 mt-1">
                          Categorization
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiTag className="h-7 w-7 text-purple-600" />
                      </div>
                    </div>
                  </div>

                  <div className="relative overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 hover:shadow-lg transition-all duration-300 group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-200 rounded-full -translate-y-16 translate-x-16 opacity-20 group-hover:opacity-30 transition-opacity"></div>
                    <div className="relative flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-orange-600">Likes</p>
                        <p className="text-3xl font-bold text-orange-900">{snippets.reduce((sum, s) => sum + (s.likes || 0), 0)}</p>
                        <p className="text-xs text-orange-600 mt-1">
                          Total likes on your snippets
                        </p>
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-orange-100 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <FiHeart className="h-7 w-7 text-orange-600" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Activity Chart */}
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 p-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiBarChart className="mr-2 h-5 w-5 text-blue-600" />
                      Activity Over Time
                    </h3>
                    <div className="h-64 flex items-end justify-between gap-2">
                      {getActivityChartData().map((item, index) => (
                        <div key={index} className="flex-1 flex flex-col items-center">
                          <div 
                            className="w-full bg-gradient-to-t from-blue-500 to-blue-600 rounded-t-lg transition-all duration-300 hover:from-blue-600 hover:to-blue-700 shadow-sm"
                            style={{ 
                              height: `${Math.max((item.count / Math.max(...getActivityChartData().map(d => d.count), 1)) * 200, 4)}px` 
                            }}
                          ></div>
                          <span className="text-xs text-gray-500 mt-2 transform rotate-45 origin-left">
                            {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiTrendingUp className="mr-2 h-5 w-5 text-green-600" />
                      Quick Stats
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Daily Average</span>
                        <span className="font-semibold text-gray-900">
                          {analytics.averageSnippetsPerDay.toFixed(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Public Snippets</span>
                        <span className="font-semibold text-gray-900">
                          {analytics.publicSnippets}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Top Category</span>
                        <span className="font-semibold text-gray-900">
                          {analytics.mostUsedCategory}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50">
                        <span className="text-sm text-gray-600">Top Tag</span>
                        <span className="font-semibold text-gray-900">
                          {analytics.mostUsedTag}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category and Tag Analysis */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiFolder className="mr-2 h-5 w-5 text-green-600" />
                      Top Categories
                    </h3>
                    <div className="space-y-4">
                      {getTopCategories().map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">{item.category}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full"
                                style={{ 
                                  width: `${(item.count / Math.max(...getTopCategories().map(c => c.count), 1)) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-8 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                      <FiTag className="mr-2 h-5 w-5 text-purple-600" />
                      Most Used Tags
                    </h3>
                    <div className="space-y-3">
                      {getTopTags().map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">#{item.tag}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                                style={{ 
                                  width: `${(item.count / Math.max(...getTopTags().map(t => t.count), 1)) * 100}%` 
                                }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-900 w-6 text-right">
                              {item.count}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Productivity Insights */}
                <div className="p-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <FiTarget className="mr-2 h-5 w-5 text-orange-600" />
                    Productivity Insights
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100">
                      <FiClock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1">Consistency</h4>
                      <p className="text-sm text-gray-600">
                        {analytics.averageSnippetsPerDay > 1 ? 'Great! You\'re creating snippets regularly.' : 'Try to create at least one snippet per day.'}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-green-50 to-green-100">
                      <FiEye className="h-8 w-8 text-green-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1">Sharing</h4>
                      <p className="text-sm text-gray-600">
                        {analytics.publicSnippets > 0 ? `You've shared ${analytics.publicSnippets} snippets with the community!` : 'Consider sharing some snippets to help others.'}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100">
                      <FiDownload className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                      <h4 className="font-semibold text-gray-900 mb-1">Organization</h4>
                      <p className="text-sm text-gray-600">
                        {analytics.totalFolders > 0 ? `You're using ${analytics.totalFolders} folders to stay organized.` : 'Create folders to better organize your snippets.'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
} 