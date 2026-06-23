import { ImageResponse } from 'next/og';

export const runtime = 'nodejs';

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(text)}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(/src: url\((.+)\) format\('(opentype|truetype)'\)/);

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error('failed to load font data');
}

export async function GET() {
  const allText =
    'kriuu. Tecnología, IA y ética tech. Comunidad · Latam Nació en Manabí. Es para todos.';

  const fontData = await loadGoogleFont('Space+Grotesk:wght@700', allText);

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          backgroundColor: '#e0ddd6',
          padding: '56px 80px',
        }}
      >
        {/* Top row: wordmark + label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 34,
              fontWeight: 700,
              color: '#333333',
              letterSpacing: '-1px',
            }}
          >
            kriuu.
          </span>
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(51,51,51,0.35)',
              letterSpacing: '3px',
              textTransform: 'uppercase',
            }}
          >
            Comunidad · Latam
          </span>
        </div>

        {/* Center: headline with lime left-border accent */}
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              borderLeft: '5px solid #cadd57',
              paddingLeft: 32,
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 96,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 0.92,
                  letterSpacing: '-4px',
                }}
              >
                Tecnología,
              </span>
              <span
                style={{
                  fontFamily: 'Space Grotesk',
                  fontSize: 96,
                  fontWeight: 700,
                  color: '#333333',
                  lineHeight: 0.92,
                  letterSpacing: '-4px',
                }}
              >
                IA y ética.
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            display: 'flex',
            height: 1,
            backgroundColor: 'rgba(51,51,51,0.15)',
            marginBottom: 20,
          }}
        />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 19,
              fontWeight: 700,
              color: 'rgba(51,51,51,0.65)',
              letterSpacing: '-0.5px',
            }}
          >
            comunidad tech · diseño · emprendimiento
          </span>
          <span
            style={{
              fontFamily: 'Space Grotesk',
              fontSize: 13,
              fontWeight: 700,
              color: 'rgba(51,51,51,0.35)',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}
          >
            Nació en Manabí. Es para todos.
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Space Grotesk',
          data: fontData,
          style: 'normal',
          weight: 700,
        },
      ],
    },
  );
}
