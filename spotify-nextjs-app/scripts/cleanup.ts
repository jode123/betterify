const { execSync } = require('child_process');
const path = require('path');

function cleanup() {
  const pipedBackendPath = path.join(__dirname, '..', 'Piped-Backend');
  
  try {
    // Use sudo to remove directory with root permissions
    execSync(`sudo rm -rf "${pipedBackendPath}"`, { stdio: 'inherit' });
    console.log('Successfully removed Piped-Backend directory');
    
    // Create a .gitkeep file to prevent recreation
    execSync(`touch "${path.join(__dirname, '..', '.gitkeep')}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error('Failed to remove directory:', error);
    process.exit(1);
  }
}

// Run cleanup
cleanup();