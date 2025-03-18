import { execSync } from 'child_process';

function deploy() {
  try {
    // Clean build artifacts
    execSync('rm -rf .next', { stdio: 'inherit' });
    
    // Build
    execSync('next build', { stdio: 'inherit' });
    
    // Deploy
    execSync('vercel --prod', { stdio: 'inherit' });
  } catch (error) {
    console.error('Deployment failed:', error);
    process.exit(1);
  }
}

deploy();