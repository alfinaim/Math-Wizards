// Local storage utilities for offline app

export const storage = {
  // Progress
  getProgress: () => {
    const data = localStorage.getItem('math_progress');
    return data ? JSON.parse(data) : [];
  },
  
  addProgress: (progress) => {
    const current = storage.getProgress();
    const newProgress = {
      ...progress,
      id: Date.now().toString(),
      created_date: new Date().toISOString()
    };
    localStorage.setItem('math_progress', JSON.stringify([...current, newProgress]));
    return newProgress;
  },

  // Avatar
  getAvatar: () => {
    const data = localStorage.getItem('math_avatar');
    return data ? JSON.parse(data) : null;
  },

  saveAvatar: (avatar) => {
    const saved = {
      ...avatar,
      id: avatar.id || '1',
      updated_date: new Date().toISOString()
    };
    localStorage.setItem('math_avatar', JSON.stringify(saved));
    return saved;
  },

  // Rewards
  getRewards: () => {
    const data = localStorage.getItem('math_rewards');
    return data ? JSON.parse(data) : [];
  },

  addReward: (reward) => {
    const current = storage.getRewards();
    const newReward = {
      ...reward,
      id: Date.now().toString(),
      earned_date: new Date().toISOString()
    };
    localStorage.setItem('math_rewards', JSON.stringify([...current, newReward]));
    return newReward;
  }
};