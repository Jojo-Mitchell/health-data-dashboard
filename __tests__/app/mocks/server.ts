import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Create test server instance
export const server = setupServer(...handlers)

// Setup request interception before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset handlers after each test (important for test isolation)
afterEach(() => {
  server.resetHandlers()
})

// Clean up after all tests are done
afterAll(() => {
  server.close()
})

// Utility function to simulate errors
export const createErrorResponse = (status: number, message?: string) => {
  return () => 
    new Response(JSON.stringify({ message: message || 'Error occurred' }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    })
}

// Utility function to simulate network delays
export const createDelayedResponse = <T>(data: T, delayMs: number = 1000) => {
  return async () => {
    await new Promise(resolve => setTimeout(resolve, delayMs))
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Utility function to override handlers during tests
export const mockEndpointOnce = (
  method: string,
  path: string,
  response: any,
  status: number = 200
) => {
  server.use(
    http[method as keyof typeof http](path, () => {
      return HttpResponse.json(response, { status })
    })
  )
}