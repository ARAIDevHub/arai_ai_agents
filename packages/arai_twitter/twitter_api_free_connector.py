from playwright.sync_api import sync_playwright

def login_and_save_state(username, password, phone_or_username, storage_path="./states/login_state.json"):
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=False, slow_mo=1000)
            context = browser.new_context()
            page = context.new_page()

            # 1) Navigate to login
            page.goto("https://x.com/login")
            page.wait_for_timeout(2000)  # Give more time to load

            # 2) Fill in username
            page.wait_for_selector('input[name="text"]', timeout=10000)
            page.fill('input[name="text"]', username)
            page.keyboard.press("Enter")
            page.wait_for_timeout(2000)  # Wait after username entry
            
            # 3) Fill in password
            page.wait_for_selector('input[name="password"]', timeout=10000)
            page.fill('input[name="password"]', password)
            page.keyboard.press("Enter")
            page.wait_for_timeout(2000)  # Wait after password entry

            # 4) Handle unusual activity only if it appears
            try:
                unusual_activity = page.wait_for_selector('input[data-testid="ocfEnterTextTextInput"]', timeout=5000)
                if unusual_activity:
                    print("[INFO] Unusual login activity popup detected.")
                    page.fill('input[data-testid="ocfEnterTextTextInput"]', phone_or_username)
                    page.keyboard.press("Enter")
                    page.wait_for_timeout(2000)
            except:
                print("[INFO] No unusual activity check needed.")

            # 5) Wait for successful login
            try:
                page.wait_for_url(lambda url: "home" in url, timeout=15000)
                print("[INFO] Successfully logged in!")
            except:
                print("[ERROR] Failed to reach home page after login")
                raise Exception("Login unsuccessful - couldn't reach home page")

            # 6) Save the state
            try:
                # Create directory if it doesn't exist
                os.makedirs(os.path.dirname(storage_path), exist_ok=True)
                
                context.storage_state(path=storage_path)
                print(f"[INFO] Storage state saved to {storage_path}")
            except Exception as e:
                print(f"[ERROR] Failed to save state: {e}")
                raise

            browser.close()
            return True

    except Exception as e:
        print(f"[ERROR] Login process failed: {e}")
        raise

def post_tweet_with_saved_state(tweet_text, storage_path="./states/login_state.json"):
    with sync_playwright() as p:
        # Create a new context with the previously saved state
        browser = p.chromium.launch(headless=False)
        context = browser.new_context(storage_state=storage_path)
        page = context.new_page()

        # Now page is already logged in if state.json is still valid
        page.goto("https://x.com/home")
        # Wait a bit for the home feed to render
        page.wait_for_timeout(1000) # optional
        # page.wait_for_load_state("networkidle")
        print("[INFO] Checking if we are indeed logged in...")

        # Post a tweet
        tweet_box_selector = 'div[data-testid="tweetTextarea_0"]'
        page.wait_for_selector(tweet_box_selector, timeout=10000)
        page.fill(tweet_box_selector, tweet_text)

        # post_button_selector = 'div[data-testid="tweetButtonInline"]'
        post_button_selector = 'button[data-testid="tweetButtonInline"]'
        # page.wait_for_selector(post_button_selector, state="visible", timeout=20000)  # Wait for visible

        page.wait_for_selector(post_button_selector, timeout=10000)
        page.click(post_button_selector)
        page.wait_for_timeout(3000)
        print("[INFO] Tweet posted (assuming no errors).")

        browser.close()

import os
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    """
    Example usage. Replace the placeholders with your real credentials.
    'phone_or_username' is used if the suspicious activity screen appears
    asking you to confirm via phone or username.
    """
    # Test post
    X_POST_TEXT = "Hello"

    # check if state.json exist
    if os.path.exists("./states/login_state.json"):
        print("[INFO] ./states/login_state.json exists. Using existing state.")
    else:
        print("[INFO] ./states/login_state.json does not exist. Logging in and saving state.")

        login_and_save_state(
            username=os.getenv("X_USERNAME"),
            password=os.getenv("X_PASSWORD"),
            phone_or_username=os.getenv("X_PHONE_OR_USERNAME"),
            storage_path="./states/login_state.json"
        )

    post_tweet_with_saved_state(
        tweet_text=X_POST_TEXT,
        storage_path="./states/login_state.json"
    )