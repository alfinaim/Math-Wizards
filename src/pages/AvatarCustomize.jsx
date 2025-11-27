import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowLeft } from 'lucide-react';
import AvatarSelector from '../components/avatar/AvatarSelector';
import { storage } from '../components/utils/storage';

export default function AvatarCustomize() {
  const navigate = useNavigate();
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    setAvatar(storage.getAvatar());
  }, []);

  const handleSave = (character, color) => {
    const savedAvatar = storage.saveAvatar({
      ...avatar,
      selected_character: character,
      selected_color: color,
      total_stars: avatar?.total_stars || 0
    });
    setAvatar(savedAvatar);
    navigate('/Home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <Button
          onClick={() => navigate('/Home')}
          variant="outline"
          className="mb-6 rounded-xl border-2 border-purple-300 bg-white hover:bg-gray-100"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back Home
        </Button>

        <AvatarSelector
          currentCharacter={avatar?.selected_character}
          currentColor={avatar?.selected_color}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}