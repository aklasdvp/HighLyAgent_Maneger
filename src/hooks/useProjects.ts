import { useEffect, useState } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import type { ClientApp } from '../lib/data';

export interface Project {
  id: string;
  name: string;
  behavior_description: string;
  platform: string;
  rate_limit_per_min: number;
  suspended: boolean;
  ai_provider?: string | null;
  ai_model?: string | null;
  daily_request_limit?: number | null;
  monthly_request_limit?: number | null;
  daily_token_limit?: number | null;
  monthly_token_limit?: number | null;
  created_at: string;
}

export interface ProjectsResponse {
  items: Project[];
  total: number;
  limit: number;
  offset: number;
}

/**
 * Hook for fetching and managing projects
 * @returns Object containing projects list, loading state, and refresh function
 */
export function useProjects() {
  const { state } = useStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  /**
   * Fetch projects from backend
   * @param limit - Number of items per page (default: 50)
   * @param offset - Offset for pagination (default: 0)
   */
  const fetchProjects = async (limit = 50, offset = 0) => {
    if (!state.session?.accessToken) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      const res = await api.projects(state.session.accessToken, { limit, offset });
      
      // Handle both paginated and non-paginated responses
      const data = res as any;
      if (Array.isArray(data)) {
        setProjects(data);
        setTotal(data.length);
      } else if (data.data) {
        const items = Array.isArray(data.data) ? data.data : (data.data.items || []);
        setProjects(items);
        setTotal(data.data.total || items.length);
      }
    } catch (e) {
      setError((e as Error).message);
      // Fall back to local state if backend unavailable
      setProjects(state.clients.map(c => ({
        id: c.id,
        name: c.name,
        behavior_description: c.desc,
        platform: c.type,
        rate_limit_per_min: c.rateLimitPerMin ?? 100,
        suspended: c.status === 'suspended',
        created_at: c.createdAt,
      })));
      setTotal(state.clients.length);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProjects();
  }, [state.session?.accessToken]);
  
  const refresh = () => fetchProjects();
  
  return {
    projects,
    total,
    loading,
    error,
    refresh,
  };
}

/**
 * Hook for fetching a single project by ID
 * @param projectId - The project ID to fetch
 * @returns Object containing project data, loading state, and error
 */
export function useProject(projectId: string) {
  const { state } = useStore();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!projectId || !state.session?.accessToken) {
      setLoading(false);
      return;
    }
    
    const fetchProject = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.getProject((state.session as any).accessToken, projectId);
        setProject(res.data);
      } catch (e) {
        setError((e as Error).message);
        // Fall back to local state
        const local = state.clients.find(c => c.id === projectId);
        if (local) {
          setProject({
            id: local.id,
            name: local.name,
            behavior_description: local.desc,
            platform: local.type,
            rate_limit_per_min: local.rateLimitPerMin ?? 100,
            suspended: local.status === 'suspended',
            created_at: local.createdAt,
          });
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, state.session?.accessToken]);
  
  return {
    project,
    loading,
    error,
  };
}
