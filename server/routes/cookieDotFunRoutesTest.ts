import dotenv from 'dotenv';
import path from 'path';
import { getAgentByTwitter, getAgentByContract, getAgentsPaged } from './cookieDotFunRoutes';

// Add at the top of the file
console.log('Current directory:', process.cwd());
console.log('__dirname:', __dirname);
const envPath = path.resolve(__dirname, '../../.env');
console.log('Looking for .env at:', envPath);
console.log('File exists?', require('fs').existsSync(envPath));

// Load environment variables from root .env file
const result = dotenv.config({ path: envPath });

if (result.error) {
    console.error('Error loading .env file:', result.error);
    console.error('Tried to load from:', envPath);
    process.exit(1);
}

// Verify environment variable is loaded
if (!process.env.COOKIE_FUN_API_KEY) {
    console.error('COOKIE_FUN_API_KEY is not set in environment variables');
    console.error('Make sure your .env file exists at:', envPath);
    console.error('And contains: COOKIE_FUN_API_KEY=your_api_key_here');
    process.exit(1);
}

const testApis = async () => {
    try {
        // Test getAgentsPaged
        console.log("----------------------------------------------------------------")
        console.log('\nTesting getAgentsPaged:');
        console.log('Using API Key:', process.env.COOKIE_FUN_API_KEY);
        const pagedData = await getAgentsPaged({ interval: '_7Days', page: 2, pageSize: 2 });
        console.log('Paged Data:', JSON.stringify(pagedData, null, 2));
        console.log('\n')
        console.log("------------------------------------------------------------------------------------------------")
        // Test getAgentByTwitter
        console.log('\nTesting getAgentByTwitter:');
        const twitterData = await getAgentByTwitter('FartCoinOfSOL', '_7Days');
        console.log('Twitter Data:', JSON.stringify(twitterData, null, 2));
        console.log('\n')
        console.log("------------------------------------------------------------------------------------------------")

        // Test getAgentByContract
        console.log('\nTesting getAgentByContract:');
        const contractData = await getAgentByContract('9BB6NFEcjBCtnNLFko2FqVQBq8HHM13kCyYcdQbgpump', '_7Days');
        console.log('Contract Data:', JSON.stringify(contractData, null, 2));
        console.log('\n')
        console.log("------------------------------------------------------------------------------------------------")
    } catch (error: any) {
        console.error('Test Error:', error.message);
        if (error.response) {
            console.error('Response Status:', error.response.status);
            console.error('Response Data:', error.response.data);
        }
    }
};

// Run the tests
testApis(); 