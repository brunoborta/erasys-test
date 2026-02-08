import type { Profile } from '@borta/user-pictures';

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {profile.name}
      </h1>
      {profile.headline && (
        <h2 className="mt-4 text-lg text-foreground-secondary font-normal">
          {profile.headline}
        </h2>
      )}
      <dl className="mt-2 text-sm text-muted">
        <dt className="sr-only">Profile ID</dt>
        <dd>Profile ID: {profile.id}</dd>
      </dl>
    </header>
  );
}
