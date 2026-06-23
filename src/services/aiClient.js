const MOCK_SOCRATES_REPLY =
  "좋아, 먼저 네 생각을 들어볼게. [예시:잘 모르겠어요|그림으로 생각해볼래요|식을 세워볼래요]";

export async function askSocrates({ history = [] } = {}) {
  void history;

  return MOCK_SOCRATES_REPLY;
}
