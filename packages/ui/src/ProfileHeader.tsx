interface ProfileHeaderProps {
  name: string;
  headline?: string;
  profileId: string;
}

export function ProfileHeader({ name, headline, profileId }: ProfileHeaderProps) {
  return (
    <header className="mb-12 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{name}</h1>
      {headline && (
        <h2 className="mt-4 text-lg text-foreground-secondary font-normal">{headline}</h2>
      )}
      <dl className="mt-2 text-sm text-muted">
        <dt className="sr-only">Profile ID</dt>
        <dd>Profile ID: {profileId}</dd>
      </dl>
    </header>
  );
}
