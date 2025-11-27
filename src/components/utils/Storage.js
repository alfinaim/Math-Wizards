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
    // Check if reward already exists
    if (current.some(r => r.id === reward.id)) return null;
    const newReward = {
      ...reward,
      earned_date: new Date().toISOString()
    };
    localStorage.setItem('math_rewards', JSON.stringify([...current, newReward]));
    return newReward;
  },

  // Adventure Progress
  getAdventure: () => {
    const data = localStorage.getItem('math_adventure');
    return data ? JSON.parse(data) : {
      currentWorld: 1,
      currentLevel: 1,
      defeatedBosses: [],
      unlockedWorlds: [1],
      totalXP: 0
    };
  },

  saveAdventure: (adventure) => {
    localStorage.setItem('math_adventure', JSON.stringify(adventure));
    return adventure;
  },

  // Endless Mode High Score
  getEndlessHighScore: () => {
    const data = localStorage.getItem('math_endless_highscore');
    return data ? JSON.parse(data) : 0;
  },

  saveEndlessHighScore: (score) => {
    const current = storage.getEndlessHighScore();
    if (score > current) {
      localStorage.setItem('math_endless_highscore', JSON.stringify(score));
      return score;
    }
    return current;
  }
};