import { readdirSync } from 'fs';
import { join } from 'path';

export async function GET() {
  try {
    const docsPath = join(process.cwd(), 'public', 'library', 'documentacion');
    const apps = readdirSync(docsPath);

    const result = apps.map((app) => {
      const appPath = join(docsPath, app);
      const pdfs = readdirSync(appPath)
        .filter((file) => file.endsWith('.pdf'))
        .map((file) => ({
          name: file,
          path: `/library/documentacion/${app}/${file}`,
          app,
        }));

      return { app, pdfs };
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: 'Error reading documents' }, { status: 500 });
  }
}
