const backToStartButton = {text: "⬅", callback_data: "start"};
const startReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Активация кода", callback_data: "instructions" }],

            [ { text: "Игры & DLC", callback_data: "games" } ],

            [ { text: "Подписки", callback_data: "subscriptions" }],

            [ { text: "Внутриигровая валюта",  callback_data: "currencies"}],
            
            [ { text: "Скидки", callback_data: "sales"}],
            
            [ { text: "Отзывы", url: "https://vk.com/topic-78122258_47627829?offset=1300" } ]
        ]
    }
};

const instructionsReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToStartButton ]
        ]
    }
};

const gamesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Игры & DLC для Xbox Series X|S и Xbox One", callback_data: "gamesXbox" }],

            [ { text: "Игры & DLC для PC", callback_data: "gamesPC" } ],

            [ { text: "Обратно совместимые игры & DLC", callback_data: "gamesXbox360" } ],
            
            [ backToStartButton ]
        ]
    }
};

const subscriptionsReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Подписки для Xbox Series X|S и Xbox One", callback_data: "subscriptionsXbox" }],

            [ { text: "Подписки для PC", callback_data: "subscriptionsPC" } ],
            
            [ backToStartButton ]
        ]
    }
};

const currenciesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Внутриигровая валюта для Xbox Series X|S и Xbox One", callback_data: "currenciesXbox" }],

            [ { text: "Внутриигровая валюта для PC", callback_data: "currenciesPC" } ],
            
            [ backToStartButton ]
        ]
    }
};

const salesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ { text: "Скидки для Xbox Series X|S и Xbox One", callback_data: "salesXbox" }],

            [ { text: "Скидки для PC", callback_data: "salesPC" } ],
            
            [ backToStartButton ]
        ]
    }
};


const backToGamesButton = {text: "⬅", callback_data: "games"};
const backToGamesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToGamesButton ]
        ]
    }
};

const backToSubscriptionsButton = {text: "⬅", callback_data: "subscriptions"};
const backToSubscriptionsReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToSubscriptionsButton ]
        ]
    }
};

const backToCurrenciesButton = {text: "⬅", callback_data: "currencies"};
const backToCurrenciesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToCurrenciesButton ]
        ]
    }
};

const backToSalesButton = {text: "⬅", callback_data: "sales"};
const backToSalesReplyMarkup = {
    reply_markup: {
        inline_keyboard: [
            [ backToSalesButton ]
        ]
    }
};


module.exports = {
    startReplyMarkup,
    
    instructionsReplyMarkup,
    gamesReplyMarkup,
    subscriptionsReplyMarkup,
    currenciesReplyMarkup,
    salesReplyMarkup,

    backToGamesReplyMarkup,
    backToSubscriptionsReplyMarkup,
    backToCurrenciesReplyMarkup,
    backToSalesReplyMarkup
};