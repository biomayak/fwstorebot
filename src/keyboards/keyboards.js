const startReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            /* Inline buttons. 2 side-by-side */
            [ { text: "Инструкции", callback_data: "instructions" }],

            /* One button */
            [ { text: "Игры", callback_data: "games" } ],
            
            /* Also, we can have URL buttons. */
            [ { text: "Отзывы", url: "https://vk.com/topic-78122258_47627829?offset=1300" } ]
        ]
    }
};

const backToStartButton = {text: "⬅", callback_data: "start"};
const otherReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToStartButton ]
        ]
    }
};


module.exports = {
    startReplyMarkup,
    otherReplyMarkup
};