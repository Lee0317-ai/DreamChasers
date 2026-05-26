export type PhotoStickerId =
  | "spark"
  | "star"
  | "heart"
  | "flower"
  | "girl-ponytail"
  | "blue-hair-face"
  | "cactus"
  | "luck-burst"
  | "cake-heart"
  | "cheer-stripe"
  | "cool-stack"
  | "good-chef"
  | "sunny-egg"
  | "potted-plant"
  | "happy-letters"
  | "orange-branch"
  | "spotted-dog"
  | "bow-chef"
  | "sleepy-pet"
  | "swim-stripe"
  | "stretch-cat"
  | "relax-sign"
  | "crown-bird"
  | "smile-croissant"
  | "sparkle-confetti"
  | "sunflower"
  | "color-paper"
  | "notebook-pencil"
  | "nice-letters"
  | "flower-pair"
  | "not-work-mug"
  | "round-dog"
  | "headphone-bunny"
  | "blossom-pig"
  | "love-panda"
  | "floating-hearts"
  | "pink-glasses"
  | "strawberry-dessert"
  | "cherry-cupcake"
  | "strawberry-popcorn"
  | "heart-pistol"
  | "pink-heart-frame"
  | "sweet-love-ticket"
  | "heart-hands"
  | "bubble-watermelon"
  | "bubble-peach"
  | "bubble-cake"
  | "bubble-burger"
  | "bubble-icecream"
  | "bubble-juice"
  | "bubble-cutlery"
  | "bubble-bowl"
  | "bubble-puppy"
  | "bubble-ghost"
  | "bubble-daisy"
  | "bubble-tulip"
  | "bubble-music"
  | "bubble-sparkles"
  | "bubble-rainbow"
  | "bubble-megaphone"
  | "bubble-eyes"
  | "bubble-bow"
  | "bubble-thumbs-up"
  | "bubble-sparkle-heart"
  | "bubble-diamond"
  | "bubble-party"
  | "guitar-cat"
  | "cat-love-word"
  | "cat-dot-row"
  | "cat-hi-word"
  | "party-cake-cat"
  | "ufo-cat"
  | "headphone-cat"
  | "dancing-cat"
  | "coffee-cat"
  | "bread-cat"
  | "heart-cat"
  | "fishing-cat"
  | "kiss-cat"
  | "heart-cats"
  | "long-cat"
  | "ghost-cat"
  | "peach-boy"
  | "orange-cat-face"
  | "pink-flower"
  | "cute-burst-cn"
  | "hello-burst"
  | "baby-letters"
  | "pastel-clouds"
  | "red-flower-stems"
  | "blue-vase"
  | "peach-girl"
  | "hi-sheep"
  | "drum-dog"
  | "fun-bunny"
  | "guitar-bear"
  | "bee-note"
  | "nice-day-star"
  | "nice-day-dog"
  | "dancing-bear"
  | "singing-dino"
  | "hi-dino"
  | "with-me-cat"
  | "best-giraffe"
  | "hi-pig"
  | "hi-duck"
  | "lala-hamster"
  | "hi-yellow-dog"
  | "oops-long-dog"
  | "love-you-puppy"
  | "how-are-you-bear"
  | "hey-cow"
  | "flower-bird"
  | "say-cheese-bear"
  | "flower-dog"
  | "xo-kangaroo"
  | "arrow"
  | "check"
  | "note"
  | "wow"
  | "lol"
  | "ribbon";

export type PhotoStickerPreset = {
  category: "decor" | "mark" | "memo";
  group?: "base" | "decor-pack" | "love-pack" | "bubble-pack" | "cat-pack" | "pastel-pack" | "animal-pack";
  id: PhotoStickerId;
  name: string;
  src: string;
};

export const photoStickerGroups = [
  { id: "base", title: "基础装饰" },
  { id: "decor-pack", title: "手绘日常" },
  { id: "love-pack", title: "粉色甜心" },
  { id: "bubble-pack", title: "气泡表情" },
  { id: "cat-pack", title: "黑白猫咪" },
  { id: "pastel-pack", title: "粉彩涂鸦" },
  { id: "animal-pack", title: "动物问候" }
] as const;

export const photoStickerPresets: PhotoStickerPreset[] = [
  { id: "spark", name: "闪光", category: "decor", group: "base", src: "/stickers/spark.svg" },
  { id: "star", name: "星星", category: "decor", group: "base", src: "/stickers/star.svg" },
  { id: "heart", name: "爱心", category: "decor", group: "base", src: "/stickers/heart.svg" },
  { id: "flower", name: "小花", category: "decor", group: "base", src: "/stickers/flower.svg" },
  { id: "girl-ponytail", name: "马尾女孩", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/girl-ponytail.png" },
  { id: "blue-hair-face", name: "蓝发头像", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/blue-hair-face.png" },
  { id: "cactus", name: "仙人掌", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/cactus.png" },
  { id: "luck-burst", name: "好运", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/luck-burst.png" },
  { id: "cake-heart", name: "蛋糕爱心", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/cake-heart.png" },
  { id: "cheer-stripe", name: "条纹举杯", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/cheer-stripe.png" },
  { id: "cool-stack", name: "酷酷叠叠", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/cool-stack.png" },
  { id: "good-chef", name: "厨师点赞", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/good-chef.png" },
  { id: "sunny-egg", name: "笑脸煎蛋", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/sunny-egg.png" },
  { id: "potted-plant", name: "盆栽", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/potted-plant.png" },
  { id: "happy-letters", name: "开心字母", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/happy-letters.png" },
  { id: "orange-branch", name: "橙果枝", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/orange-branch.png" },
  { id: "spotted-dog", name: "斑点小狗", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/spotted-dog.png" },
  { id: "bow-chef", name: "弯腰厨师", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/bow-chef.png" },
  { id: "sleepy-pet", name: "趴趴小宠", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/sleepy-pet.png" },
  { id: "swim-stripe", name: "泳圈条纹", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/swim-stripe.png" },
  { id: "stretch-cat", name: "伸展小猫", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/stretch-cat.png" },
  { id: "relax-sign", name: "放松举牌", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/relax-sign.png" },
  { id: "crown-bird", name: "皇冠飞鸟", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/crown-bird.png" },
  { id: "smile-croissant", name: "笑脸可颂", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/smile-croissant.png" },
  { id: "sparkle-confetti", name: "闪光彩点", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/sparkle-confetti.png" },
  { id: "sunflower", name: "向日葵", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/sunflower.png" },
  { id: "color-paper", name: "彩纸", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/color-paper.png" },
  { id: "notebook-pencil", name: "本子铅笔", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/notebook-pencil.png" },
  { id: "nice-letters", name: "Nice 字母", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/nice-letters.png" },
  { id: "flower-pair", name: "花朵组合", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/flower-pair.png" },
  { id: "not-work-mug", name: "休息杯", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/not-work-mug.png" },
  { id: "round-dog", name: "圆圆小狗", category: "decor", group: "decor-pack", src: "/stickers/decor-pack/round-dog.png" },
  { id: "headphone-bunny", name: "耳机兔兔", category: "decor", group: "love-pack", src: "/stickers/love-pack/headphone-bunny.png" },
  { id: "blossom-pig", name: "花朵小猪", category: "decor", group: "love-pack", src: "/stickers/love-pack/blossom-pig.png" },
  { id: "love-panda", name: "爱心熊猫", category: "decor", group: "love-pack", src: "/stickers/love-pack/love-panda.png" },
  { id: "floating-hearts", name: "粉色爱心", category: "decor", group: "love-pack", src: "/stickers/love-pack/floating-hearts.png" },
  { id: "pink-glasses", name: "粉色酒杯", category: "decor", group: "love-pack", src: "/stickers/love-pack/pink-glasses.png" },
  { id: "strawberry-dessert", name: "草莓甜品", category: "decor", group: "love-pack", src: "/stickers/love-pack/strawberry-dessert.png" },
  { id: "cherry-cupcake", name: "樱桃纸杯蛋糕", category: "decor", group: "love-pack", src: "/stickers/love-pack/cherry-cupcake.png" },
  { id: "strawberry-popcorn", name: "草莓爆米花", category: "decor", group: "love-pack", src: "/stickers/love-pack/strawberry-popcorn.png" },
  { id: "heart-pistol", name: "爱心水枪", category: "decor", group: "love-pack", src: "/stickers/love-pack/heart-pistol.png" },
  { id: "pink-heart-frame", name: "粉色心框", category: "decor", group: "love-pack", src: "/stickers/love-pack/pink-heart-frame.png" },
  { id: "sweet-love-ticket", name: "甜蜜票券", category: "decor", group: "love-pack", src: "/stickers/love-pack/sweet-love-ticket.png" },
  { id: "heart-hands", name: "比心手势", category: "decor", group: "love-pack", src: "/stickers/love-pack/heart-hands.png" },
  { id: "bubble-watermelon", name: "气泡西瓜", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-watermelon.png" },
  { id: "bubble-peach", name: "气泡桃子", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-peach.png" },
  { id: "bubble-cake", name: "气泡蛋糕", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-cake.png" },
  { id: "bubble-burger", name: "气泡汉堡", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-burger.png" },
  { id: "bubble-icecream", name: "气泡冰淇淋", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-icecream.png" },
  { id: "bubble-juice", name: "气泡果汁", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-juice.png" },
  { id: "bubble-cutlery", name: "气泡餐具", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-cutlery.png" },
  { id: "bubble-bowl", name: "气泡碗", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-bowl.png" },
  { id: "bubble-puppy", name: "气泡小狗", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-puppy.png" },
  { id: "bubble-ghost", name: "气泡幽灵", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-ghost.png" },
  { id: "bubble-daisy", name: "气泡雏菊", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-daisy.png" },
  { id: "bubble-tulip", name: "气泡郁金香", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-tulip.png" },
  { id: "bubble-music", name: "气泡音符", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-music.png" },
  { id: "bubble-sparkles", name: "气泡闪光", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-sparkles.png" },
  { id: "bubble-rainbow", name: "气泡彩虹", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-rainbow.png" },
  { id: "bubble-megaphone", name: "气泡喇叭", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-megaphone.png" },
  { id: "bubble-eyes", name: "气泡眼睛", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-eyes.png" },
  { id: "bubble-bow", name: "气泡蝴蝶结", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-bow.png" },
  { id: "bubble-thumbs-up", name: "气泡点赞", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-thumbs-up.png" },
  { id: "bubble-sparkle-heart", name: "气泡闪光爱心", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-sparkle-heart.png" },
  { id: "bubble-diamond", name: "气泡钻石", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-diamond.png" },
  { id: "bubble-party", name: "气泡派对", category: "decor", group: "bubble-pack", src: "/stickers/bubble-pack/bubble-party.png" },
  { id: "guitar-cat", name: "吉他猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/guitar-cat.png" },
  { id: "cat-love-word", name: "猫咪 Love", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/cat-love-word.png" },
  { id: "cat-dot-row", name: "猫咪点点", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/cat-dot-row.png" },
  { id: "cat-hi-word", name: "猫咪 Hi", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/cat-hi-word.png" },
  { id: "party-cake-cat", name: "蛋糕猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/party-cake-cat.png" },
  { id: "ufo-cat", name: "飞碟猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/ufo-cat.png" },
  { id: "headphone-cat", name: "耳机猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/headphone-cat.png" },
  { id: "dancing-cat", name: "跳舞猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/dancing-cat.png" },
  { id: "coffee-cat", name: "咖啡猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/coffee-cat.png" },
  { id: "bread-cat", name: "面包猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/bread-cat.png" },
  { id: "heart-cat", name: "爱心猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/heart-cat.png" },
  { id: "fishing-cat", name: "钓鱼猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/fishing-cat.png" },
  { id: "kiss-cat", name: "亲亲猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/kiss-cat.png" },
  { id: "heart-cats", name: "爱心猫咪", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/heart-cats.png" },
  { id: "long-cat", name: "长长猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/long-cat.png" },
  { id: "ghost-cat", name: "幽灵猫", category: "decor", group: "cat-pack", src: "/stickers/cat-pack/ghost-cat.png" },
  { id: "peach-boy", name: "桃子男孩", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/peach-boy.png" },
  { id: "orange-cat-face", name: "橘猫头像", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/orange-cat-face.png" },
  { id: "pink-flower", name: "粉色花朵", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/pink-flower.png" },
  { id: "cute-burst-cn", name: "可爱爆炸框", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/cute-burst-cn.png" },
  { id: "hello-burst", name: "Hello 爆炸框", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/hello-burst.png" },
  { id: "baby-letters", name: "Baby 字母", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/baby-letters.png" },
  { id: "pastel-clouds", name: "粉彩云朵", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/pastel-clouds.png" },
  { id: "red-flower-stems", name: "红花枝", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/red-flower-stems.png" },
  { id: "blue-vase", name: "蓝色花瓶", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/blue-vase.png" },
  { id: "peach-girl", name: "桃子女孩", category: "decor", group: "pastel-pack", src: "/stickers/pastel-pack/peach-girl.png" },
  { id: "hi-sheep", name: "Hi 小羊", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hi-sheep.png" },
  { id: "drum-dog", name: "敲鼓小狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/drum-dog.png" },
  { id: "fun-bunny", name: "开心兔兔", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/fun-bunny.png" },
  { id: "guitar-bear", name: "吉他熊", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/guitar-bear.png" },
  { id: "bee-note", name: "小蜜蜂", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/bee-note.png" },
  { id: "nice-day-star", name: "好日子星星", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/nice-day-star.png" },
  { id: "nice-day-dog", name: "好日子小狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/nice-day-dog.png" },
  { id: "dancing-bear", name: "跳舞熊", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/dancing-bear.png" },
  { id: "singing-dino", name: "唱歌恐龙", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/singing-dino.png" },
  { id: "hi-dino", name: "Hi 恐龙", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hi-dino.png" },
  { id: "with-me-cat", name: "和我一起猫", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/with-me-cat.png" },
  { id: "best-giraffe", name: "最棒长颈鹿", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/best-giraffe.png" },
  { id: "hi-pig", name: "Hi 小猪", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hi-pig.png" },
  { id: "hi-duck", name: "Hi 小鸭", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hi-duck.png" },
  { id: "lala-hamster", name: "啦啦仓鼠", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/lala-hamster.png" },
  { id: "hi-yellow-dog", name: "Hi 黄狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hi-yellow-dog.png" },
  { id: "oops-long-dog", name: "Oops 长狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/oops-long-dog.png" },
  { id: "love-you-puppy", name: "爱你小狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/love-you-puppy.png" },
  { id: "how-are-you-bear", name: "问候小熊", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/how-are-you-bear.png" },
  { id: "hey-cow", name: "Hey 小牛", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/hey-cow.png" },
  { id: "flower-bird", name: "送花小鸟", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/flower-bird.png" },
  { id: "say-cheese-bear", name: "拍照小熊", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/say-cheese-bear.png" },
  { id: "flower-dog", name: "送花小狗", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/flower-dog.png" },
  { id: "xo-kangaroo", name: "袋鼠乐手", category: "decor", group: "animal-pack", src: "/stickers/animal-pack/xo-kangaroo.png" },
  { id: "arrow", name: "箭头", category: "mark", src: "/stickers/arrow.svg" },
  { id: "check", name: "勾选", category: "mark", src: "/stickers/check.svg" },
  { id: "ribbon", name: "NEW 标签", category: "mark", src: "/stickers/ribbon.svg" },
  { id: "note", name: "可爱涂鸦", category: "memo", src: "/stickers/note.svg" },
  { id: "wow", name: "WOW", category: "memo", src: "/stickers/wow.svg" },
  { id: "lol", name: "LOL", category: "memo", src: "/stickers/lol.svg" }
];

export const photoStickerCategories = [
  { id: "decor", title: "装饰" },
  { id: "mark", title: "标注" },
  { id: "memo", title: "便签" }
] as const;
