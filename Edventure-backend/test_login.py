import requests
import json

def test_login():
    login_url = "http://127.0.0.1:5000/test-login"
    
    # Test credentials
    credentials = {
        "email": "test@example.com",
        "password": "test123"
    }
    
    # Attempt login
    response = requests.post(login_url, json=credentials)
    
    # Print response for debugging
    print(f"Status code: {response.status_code}")
    print(f"Response headers: {response.headers}")
    
    try:
        result = response.json()
        print(json.dumps(result, indent=4))
        
        if result.get("success"):
            token = result.get("token")
            print(f"\nToken: {token}")
            print("\nTesting token with auth-test endpoint...")
            
            # Test the token
            auth_test_url = "http://127.0.0.1:5000/auth-test"
            headers = {"Authorization": f"Bearer {token}"}
            
            auth_test_response = requests.get(auth_test_url, headers=headers)
            print(f"Auth test status code: {auth_test_response.status_code}")
            print(json.dumps(auth_test_response.json(), indent=4) if auth_test_response.status_code == 200 else auth_test_response.text)
            
            # Now test with notes API
            notes_url = "http://127.0.0.1:5000/notes/all"
            notes_response = requests.get(notes_url, headers=headers)
            print(f"\nNotes API status code: {notes_response.status_code}")
            print(json.dumps(notes_response.json(), indent=4) if notes_response.status_code == 200 else notes_response.text)
            
            # Manual test URL for browser testing
            print(f"\nFor manual testing, use this URL in the browser:")
            print(f"http://127.0.0.1:5000/auth-test")
            print(f"With header: Authorization: Bearer {token}")
            
    except Exception as e:
        print(f"Error parsing response: {str(e)}")

if __name__ == "__main__":
    test_login() 