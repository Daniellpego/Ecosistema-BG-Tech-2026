const fs = require('fs');
const path = require('path');

const configDir = path.join(__dirname, 'js');
if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
}

const configPath = path.join(configDir, 'config.js');

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

const content = `// Auto-generated during build
export const CONFIG = {
    SUPABASE_URL: "${supabaseUrl}",
    SUPABASE_ANON_KEY: "${supabaseKey}"
};
`;

try {
    fs.writeFileSync(configPath, content);
    console.log('✅ js/config.js generated successfully!');
} catch (err) {
    console.error('❌ Failed to generate js/config.js:', err);
    process.exit(1);
}
