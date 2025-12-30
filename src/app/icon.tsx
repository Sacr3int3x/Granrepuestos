import { ImageResponse } from 'next/og';
import Image from 'next/image';
import Logo from '@/components/LogoGR.png';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          borderRadius: '50%',
        }}
      >
        <Image
          src={Logo}
          alt="GranRepuestos Logo"
          width={28}
          height={28}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
