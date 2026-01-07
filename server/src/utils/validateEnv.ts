const validateEnv = () => {
    const required = [
        'MONGODB_URI',
        'JWT_SECRET',
        'GMAIL_USER',
        'GMAIL_APP_PASS'
    ];

    required.forEach(name => {
        if (!process.env[name]) {
            console.error(`Error: Environment variable ${name} is missing.`);
            process.exit(1);
        }
    });
};

export default validateEnv;
