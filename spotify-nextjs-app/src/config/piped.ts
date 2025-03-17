// List of Piped instances with API endpoints
const PIPED_INSTANCES = [
  'https://piped.video',
  'https://piped.kavin.rocks',
  'https://piped.syncpundit.io',
  'https://piped.mha.fi'
]

const API_INSTANCES = [
  'https://pipedapi.kavin.rocks',
  'https://pipedapi.syncpundit.io',
  'https://pipedapi.mha.fi',
  'https://pipedapi.tokhmi.xyz'
]

const API_INSTANCES_WITH_ENDPOINTS = API_INSTANCES.map(url => `${url}/api/v1`)

// Keep track of current working instances
let currentPipedInstance = PIPED_INSTANCES[0]
let currentApiInstance = API_INSTANCES_WITH_ENDPOINTS[0]

// Function to test if an instance is responding
async function testInstance(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(url, { 
      method: 'HEAD',
      signal: controller.signal
    });

    clearTimeout(timeoutId);
    return response.ok;
  } catch {
    return false;
  }
}

// Function to find working instances
async function findWorkingInstances() {
  // Test API instances
  for (const api of API_INSTANCES_WITH_ENDPOINTS) {
    if (await testInstance(api)) {
      currentApiInstance = api
      break
    }
  }

  // Test Frontend instances
  for (const instance of PIPED_INSTANCES) {
    if (await testInstance(instance)) {
      currentPipedInstance = instance
      break
    }
  }
}

// Initialize working instances
findWorkingInstances()
  .catch(console.error)

// Export current instances with getters to always get the working ones
export const getPipedInstance = () => currentPipedInstance
export const getPipedApiInstance = () => currentApiInstance

// Export function to force instance refresh
export const refreshInstances = () => findWorkingInstances()

export const PIPED_INSTANCE = PIPED_INSTANCES[0]
export const PIPED_API_INSTANCE = `${API_INSTANCES[0]}/api/v1`