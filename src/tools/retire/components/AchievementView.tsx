import { Achievement } from '../model/achievement';

interface AchievementViewProps {
  achievements: Achievement[];
}

export const AchievementView = ({achievements}: AchievementViewProps) => {
  if (achievements.length === 0) {
    return null;
  }

  return (
    <div className={'border shadow p-2'}>
      <div className={'text-lg text-center'}>
        成就
      </div>
      <div className={'flex flex-col'}>
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={'grid grid-cols-[auto_1fr] grid-rows-[auto_1fr] gap-x-2'}
          >
            <img
              src={achievement.icon.src}
              alt={achievement.name}
              width={48}
              height={48}
              className={'row-span-2'}
            />
            <div className={'text-lg'}>
              {achievement.name}
            </div>
            <div className={'text-xs text-gray-500'}>
              {achievement.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};