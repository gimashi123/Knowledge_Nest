import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

export function useSkillPostNavigation() {
  const navigate = useNavigate();

  const goToSkillPosts = useCallback(() => {
    navigate('/skill-posts');
  }, [navigate]);

  const goToSkillPostDetail = useCallback((id: string) => {
    navigate(`/skill-posts/${id}`);
  }, [navigate]);

  const goToCreateSkillPost = useCallback(() => {
    navigate('/skill-posts', { state: { openCreateForm: true } });
  }, [navigate]);

  return {
    goToSkillPosts,
    goToSkillPostDetail,
    goToCreateSkillPost
  };
} 