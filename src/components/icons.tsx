import Image from 'next/image';
import LogoGR from '@/components/LogoGR.png';

export const Icons = {
  logo: ({ className }: { className?: string }) => (
    <div className={className} style={{ position: 'relative' }}>
      <Image
        src={LogoGR}
        alt="GranRepuestos Logo"
        fill
        sizes="100%"
        style={{ objectFit: 'contain' }}
        priority
      />
    </div>
  ),
};
