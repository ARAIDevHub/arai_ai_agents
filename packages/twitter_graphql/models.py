from dataclasses import dataclass, field
from typing import Optional, List, Dict
from datetime import datetime

@dataclass
class User:
    id_str: str
    name: str
    screen_name: str
    profile_image_url_https: Optional[str] = None
    description: Optional[str] = None
    verified: Optional[bool] = False
    protected: Optional[bool] = False
    followers_count: Optional[int] = 0
    friends_count: Optional[int] = 0
    profile_banner_url: Optional[str] = None
    location: Optional[str] = ""
    created_at: Optional[str] = None
    pinned_tweet_ids_str: Optional[List[str]] = field(default_factory=list)
    url: Optional[str] = None

@dataclass
class Tweet:
    id_str: str
    created_at: str
    user: User
    full_text: Optional[str] = None
    retweet_count: Optional[int] = 0
    favorite_count: Optional[int] = 0
    reply_count: Optional[int] = 0
    quote_count: Optional[int] = 0
    in_reply_to_status_id_str: Optional[str] = None
    quoted_status_id_str: Optional[str] = None
    entities: Optional[Dict] = field(default_factory=dict)
    extended_entities: Optional[Dict] = field(default_factory=dict)
    is_quote_status: Optional[bool] = False
    is_retweet: Optional[bool] = False
    retweeted_status: Optional['Tweet'] = None
    quoted_status: Optional['Tweet'] = None
    lang: Optional[str] = None
    possibly_sensitive: Optional[bool] = False
    source: Optional[str] = None
    truncated: Optional[bool] = False
    coordinates: Optional[Dict] = field(default_factory=dict)
    place: Optional[Dict] = field(default_factory=dict)
    geo: Optional[Dict] = field(default_factory=dict)
    contributors: Optional[List] = field(default_factory=list)
    display_text_range: Optional[List[int]] = field(default_factory=list)
    scopes: Optional[Dict] = field(default_factory=dict)
    self_thread: Optional[Dict] = field(default_factory=dict)
    is_note_tweet: Optional[bool] = False
    note_tweet: Optional[Dict] = field(default_factory=dict)
    card: Optional[Dict] = field(default_factory=dict)
    vibe: Optional[Dict] = field(default_factory=dict)
    limited_actions: Optional[str] = None
    parent: Optional['Tweet'] = None
    ancestors: Optional[List['Tweet']] = field(default_factory=list)

    @property
    def created_at_datetime(self) -> datetime:
        return datetime.strptime(self.created_at, '%a %b %d %H:%M:%S %z %Y')

    @property
    def url(self) -> str:
        return f"https://twitter.com/{self.user.screen_name}/status/{self.id_str}"

@dataclass
class Trend:
    name: str
    url: str
    tweet_count: Optional[int] = None

@dataclass
class DirectMessage:
    id: str
    created_at: str
    sender_id: str
    recipient_id: str
    text: str
    media_urls: Optional[List[str]] = None

@dataclass
class DirectMessageConversation:
    conversation_id: str
    messages: List[DirectMessage]
    participants: List[User]

@dataclass
class AudioSpace:
    id: str
    title: str
    state: str
    creator: User
    started_at: Optional[int] = None
    ended_at: Optional[int] = None
    scheduled_start: Optional[int] = None
    is_ticketed: Optional[bool] = False
    participant_count: Optional[int] = 0
    total_live_listeners: Optional[int] = 0
    total_replay_watched: Optional[int] = 0
    topics: Optional[List[Dict]] = field(default_factory=list)
    narrow_cast_space_type: Optional[int] = 0
    subscriber_count: Optional[int] = 0
    tickets_sold: Optional[int] = 0
    tickets_total: Optional[int] = 0

@dataclass
class Article:
    id: str
    text: str
    entities: Dict
    rtl: bool
    user: User
    created_at: str
    in_reply_to_status_id: Optional[str] = None
    in_reply_to_user_id: Optional[str] = None
    in_reply_to_screen_name: Optional[str] = None
    extended_entities: Optional[Dict] = None
    lang: Optional[str] = None
    source: Optional[str] = None
    truncated: Optional[bool] = False
    coordinates: Optional[Dict] = None
    place: Optional[Dict] = None
    geo: Optional[Dict] = None
    contributors: Optional[List] = None
    display_text_range: Optional[List[int]] = None
    scopes: Optional[Dict] = None
    self_thread: Optional[Dict] = None
    is_note_tweet: Optional[bool] = False
    note_tweet: Optional[Dict] = None
    card: Optional[Dict] = None
    vibe: Optional[Dict] = None
    limited_actions: Optional[str] = None
    parent: Optional['Article'] = None
    ancestors: Optional[List['Article']] = field(default_factory=list)

    @property
    def created_at_datetime(self) -> datetime:
        return datetime.strptime(self.created_at, '%a %b %d %H:%M:%S %z %Y')

    @property
    def url(self) -> str:
        return f"https://twitter.com/{self.user.screen_name}/status/{self.id}"