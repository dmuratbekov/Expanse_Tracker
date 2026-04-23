const fs = require('fs');
const path = require('path');
const pool = require('./db');

async function runMigrations() {
    const migrationsDir = path.join(__dirname, '../../migrations');

    const files = fs.readdirSync(migrationsDir)
        .filter(f => f.endsWith('.sql'))
        .sort();

    console.log(`Migrations found: ${files.length}`);

    for (const file of files) {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        try {
            await pool.query(sql);
            console.log(`Done ${file}`);
        } catch (err) {
            console.error(`Error in ${file}:`, err.message);
            process.exit(1);
        }
    }

    console.log('All migrations were successful!');
    process.exit(0);
}

runMigrations();