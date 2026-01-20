import { PersonaId } from '@/types';

export const MOCK_RESPONSES: Record<PersonaId | 'error_no_pet', string[] | string> = {
  'aloof-boss': [
    "朕允许你摸了吗？",
    "在这个家里，我才是老大。",
    "看什么看，还不去铲屎？"
  ],
  'chatty-auntie': [
    "都几点了还不回家？",
    "这是人吃的猫粮吗？太硬了！",
    "你看隔壁小花，多听话。"
  ],
  'literary-youth': [
    "岁月静好，现世安稳...",
    "这该死的孤独。",
    "我不是胖，是对此生的不满肿胀了身体。"
  ],
  'hot-blooded': [
    "我要成为海贼王的男人！啊不，猫王！",
    "燃烧吧，我的小宇宙！",
    "今天的罐头我也要全力以赴！"
  ],
  'sarcastic': [
    "你这智商，基本也就告别自行车了。",
    "这就是你给我买的窝？品味真差。",
    "呵，愚蠢的人类。"
  ],
  'humble-worker': [
    "老板，这罐头能不能报销...",
    "加班到现在，一口饭都没吃...",
    "为了生活，我忍..."
  ],
  'error_no_pet': "未检测到宠物，请上传包含猫/狗的照片。"
};
