'use client';

import Image from 'next/image';

interface LumoLogoProps {
  size?: 'nav' | 'footer';
}

export default function LumoLogo({ size = 'nav' }: LumoLogoProps) {
  const isFooter = size === 'footer';

  return (
    <Image
      src={isFooter ? '/logos/lumo_logo_footer@2x.png' : '/logos/lumo_logo_nav@2x.png'}
      alt='Lumo'
      width={isFooter ? 200 : 120}
      height={isFooter ? 51 : 30}
      priority
      style={{ objectFit: 'contain' }}
    />
  );
}
