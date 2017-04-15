var Translation = {
    info: {
        language: {
            short: 'RU',
            full: 'Русский',
        },
        version: 2,
        author: 'VLADOS776',
        date: '24.01.17', /* Day.Month.Year */
    },
    
    translation: {
        menu: {
            more_coins: {
                text: 'Получить монеты',
                en: 'Get more coins'
            },
            to_next_level: {
                text: '${1} до следующего уровня',
                en: '${1} to next level'
            },
            open_case: {
                text: 'Открыть кейсы',
                en: 'Open Case'
            },
            cases_menu: {
                official: {
                    text: 'Стандартные кейсы',
                    en: 'Official cases'
                },
                custom: {
                    text: 'Кейсы игроков',
                    en: 'Custom cases'
                }
            },
            games: {
                text: 'Игры',
                en: 'Games'
            },
            online_games: {
                text: 'Онлайн игры',
                en: 'Online games'
            },
            games_list: {
                jackpot: {
                    text: 'Джекпот',
                    en: 'Jackpot'
                },
                rps: {
                    text: 'Камень-ножницы-бумага',
                    en: 'Rock-Paper-Scissors'
                },
                coinflip: {
                    text: 'Монетка',
                    en: 'CoinFlip'
                },
                double: {
                    text: 'Дабл',
                    en: 'Double'
                },
                crash: {
                    text: 'Краш',
                    en: 'Crash'
                },
                dice: {
                    text: 'Кости',
                    en: 'Dice'
                },
                minesweeper: {
                    text: 'Сапер',
                    en: 'Minesweeper'
                }
            },
            inventory: {
                text: 'Инвентарь',
                en: 'My inventory'
            },
            market: {
                text: 'Магазин',
                en: 'Market'
            },
            chat: {
                text: 'Чат',
                en: 'Chat'
            },
            faq: {
                text: 'FAQ',
                en: 'FAQ'
            },
            statistic: {
                text: 'Статистика',
                en: 'Statistic'
            },
            updates: {
                text: 'Обновления',
                en: 'Updates'
            },
            settings: {
                text: 'Настройки',
                en: 'Settings'
            },
            about: {
                text: 'О программе',
                en: 'About'
            },
            other_apps: {
                text: 'Другие приложения',
                en: 'Other apps'
            },
            more_coins_modal: {
                title: {
                    text: 'Получить монеты',
                    en: 'Get more coins'
                },
                body: {
                    text: 'Если вам не хватает монет, вы можете посмотреть рекламу и получить 1000<i class="double-icon"></i>',
                    en: 'If you have no coins, you can watch the ad and get 1000 <i class="double-icon"></i>'
                },
                watch: {
                    text: 'Смотреть рекламу',
                    en: 'Watch the ad'
                },
                cancel: {
                    text: 'Закрыть',
                    en: 'Cancel'
                }
            }
        },
        cases: {
            news: {
                text: 'Создай свой кейс и получай 3% от каждого открытия! (Только если вы зарегистрированы)<p>Теперь, если вы кликните на нижний банер, он будет спрятан до конца дня.</p>'
            },
            page_name: {
                text: 'Открыть кейсы',
                en: 'Open Cases'
            },
            cases: {
                text: 'Кейсы',
                en: 'Cases'
            },
            esports: {
                text: 'eSports',
                en: 'eSports'
            },
            collections: {
                text: 'Коллекции',
                en: 'Collections'
            },
            souvenir: {
                text: 'Сувенирные коллекции',
                en: 'Souvenir collections'
            },
            workshop: {
                text: 'Мастерская',
                en: 'Workshop'
            },
            special: {
                text: 'Особые',
                en: 'Special'
            },
            special_popup: {
                need_more_cases: {
                    text: 'Чтобы открыть специальный кейс, откройте ещё <i>${1}</i> кейсов.<br>Или посмотрите рекламу.',
                    en: 'To open a special case you need to open <i>${1}</i> more cases.<br>Or watch the ads.'
                },
                ad_button: {
                    text: 'Посмотреть рекламу',
                    en: 'Watch the ads'
                },
                low_level: {
                    text: 'Только игроки с уровнем <i>${1}</i> и выше могут открыть этот кейс.',
                    en: 'Only players with level <i>${1}</i> and higher can open this case.'
                },
                lvl_up: {
                    text: 'Как повысить уровень?',
                    en: 'How to level up?'
                }
            },
            awards_modal: {
                head: {
                    text: 'Награды'
                },
                body: {
                    text: "<p>Теперь в профиле появились награды!</p><p>Правда, пока что они даются только за созданные кейсы. Но в планах награды для краша/дабла/джекпота.</p> <p>Список доступных наград на данный момент:</p><ul class='list-unstyled'><li><img src='../images/awards/1k.png' width='50px'> — 1000+ открытий созданного кейса</li><li><img src='../images/awards/2k.png' width='50px'> — 2000+ открытий созданного кейса</li><li><img src='../images/awards/3k.png' width='50px'> — 3000+ открытий созданного кейса</li><li><img src='../images/awards/4k.png' width='50px'> — 4000+ открытий созданного кейса</li><li><img src='../images/awards/5k.png' width='50px'> — 5000+ открытий созданного кейса</li></ul><p>Изображения наград - временные. Потом они будут перерисованы.</p>"
                }
            }
        },
        open_case: {
            open_case: {
                text: 'Открыть кейс',
                en: 'Open case'
            },
            opening: {
                text: 'Открываем кейс...',
                en: 'Opening...'
            },
            try_again: {
                text: 'Открыть еще раз',
                en: 'Open again'
            },
            you_won: {
                text: 'Вы выиграли',
                en: 'You won'
            },
            sell: {
                text: 'Продать',
                en: 'Sell'
            },
            opened: {
                text: 'Открыто:',
                en: 'Opened:'
            },
            what_in_case: {
                text: 'Что в кейсе?',
                en: 'What\'s in the case?'
            },
            you_can_win: {
                text: 'Вы можете выиграть один из данных предметов из коллекции ${1}',
                en: 'You can win one of those items from collection ${1}'
            }
        },
        custom_cases: {
            page_name: {
                text: 'Кейсы игроков',
                en: 'Custom cases'
            },
            create_case: {
                text: 'Создать кейс',
                en: 'Create case'
            },
            recent: {
                text: 'Недавно созданные',
                en: 'Recent'
            },
            popular: {
                text: 'Популярные',
                en: 'Popular'
            },
            popular_time: {
                24: {
                    text: '24 часа',
                    en: '24 hours'
                },
                48: {
                    text: '48 часов',
                    en: '48 hours'
                },
                week: {
                    text: '7 дней',
                    en: '7 days'
                },
            },
            hide_search: {
                text: 'Убрать результаты поиска',
                en: 'Hide search result'
            },
            you_won: {
                text: 'Вы выиграли',
                en: 'You won'
            },
            sell: {
                text: 'Продать',
                en: 'Sell'
            },
            opened: {
                text: 'Открыт:',
                en: 'Opened:'
            },
            case_by: {
                text: 'Кейс сделал',
                en: 'Case by'
            },
            what_in_case: {
                text: 'Что в кейсе?',
                en: 'What\'s in the case?'
            },
            you_can_win: {
                text: 'Вы можете выиграть один из данных предметов из кейса "${1}"',
                en: 'You can win one of those items from the "${1}" case'
            },
            create: {
                name: {
                    text: 'Название',
                    en: 'Name'
                },
                picture: {
                    text: 'Выберите изображение кейса',
                    en: 'Choose case picture'
                },
                items: {
                    text: 'Выберите предметы для кейса',
                    en: 'Select items'
                },
                odds: {
                    text: 'Укажите шансы на выпадение',
                    en: 'Choose Roll Chance'
                },
                total_odds: {
                    text: 'Сумма шансов: ${1}',
                    en: 'Total odds: ${1}'
                },
                case_price: {
                    text: 'Цена кейса: ${1}',
                    en: 'Case price: ${1}'
                },
                calc_price: {
                    text: 'Посчитать стоимость',
                    en: 'Calc Price'
                },
                
            },
            beta_modal: {
                text: '<p>Данная страница находится в Бета тесте.<br>\
                    Это значит, что тут могут быть ошибки, созданные кейсы могут быть удалены и изменены без предупреждения.</p>\
                    <p>После релиза, все кейсы, созданные во время бета теста, могут быть удалены.</p>',
                en: '<p>Current page is on Beta test.<br>\
                        That means that there can be bugs and cases that you created can be deleted or changed without warning.</p>\
                        <p>After release all custom cases can be deleted.</p>'
            },
            boost_modal: {
                text: '<h5>Как это работает?</h5>\
                       <p>Вы смотрите рекламу за это ваш кейс попадает в "Популярное за 24 часа" на 10 минут.</p><p>Если на данный момент в популярном уже есть забущенный кейс, ваш кейс будет добавлен в очередь на показ.</p>',
                en: '<h5>How it works?</h5>\
                        <p>You watch the ad then your case will be in first place in "Popular 24h" for 10 minutes.</p>\
                        <p>If the "Popular" already have a boosted case, your case will get in line.</p>'
            }
        },
        jackpot: {
            page_name: {
                text: 'Джекпот',
                en: 'Jackpot'
            },
            add_items: {
                text: 'Внести предметы',
                en: 'Add items'
            },
            choose_items: {
                text: 'Внести предметы',
                en: 'Add selected items'
            },
            difficulty: {
                1: {
                    text: 'Очень легко $0.1 - $5',
                    en: 'Easy peasy $0.1 - $5'
                },
                2: {
                    text: 'Легко $5 - $30',
                    en: 'Easy $5 - $30'
                },
                3: {
                    text: 'Нормально $30 - $80',
                    en: 'Normal $30 - $80'
                },
                4: {
                    text: 'Сложно $80 - $200',
                    en: 'Hard $80 - $200'
                },
                5: {
                    text: 'Легендарно $200 - $∞',
                    en: 'Legendary $200 - $∞'
                }
            },
            winner: {
                text: 'Победитель',
                en: 'The winner'
            },
            select_room: {
                text: 'Выберите комнату',
                en: 'Select room'
            },
            back_items: {
                text: 'Забрать предметы',
                en: 'Get Items back'
            },
            chat: {
                top: {
                    text: 'Чат',
                    en: 'Chat'
                },
                current_room: {
                    text: 'Текущая комната',
                    en: 'Current room'
                },
                all: {
                    text: 'Все',
                    en: 'All'
                }
            }
        },
        rps: {
            page_name: {
                text: 'Камень-Ножницы-Бумага',
                en: 'RPS Battle'
            },
            status: {
                start: {
                    text: 'Внесите оружие, чтобы начать игру.',
                    en: 'Add weapons to start a game.'
                },
                round_win: {
                    text: 'Вы победили в этом раунде!',
                    en: 'You win this round!'
                },
                round_lost: {
                    text: 'Вы проиграли в этом раунде.',
                    en: 'You lost this round.'
                },
                round_tie: {
                    text: 'Ничья!',
                    en: 'Tie!'
                },
                win: {
                    text: 'Вы победили!',
                    en: 'You win!'
                },
                lost: {
                    text: 'Вы проиграли',
                    en: 'You lost.'
                }
            },
            scores: {
                you: {
                    text: 'Вы',
                    en: 'You'
                },
                comp: {
                    text: 'Противник',
                    en: 'Opponent'
                }
            },
            you_add: {
                text: 'Вы добавили:',
                en: 'You added:'
            },
            comp_add: {
                text: 'Противник добавил:',
                en: 'Opponent added:'
            },
            choose_hand: {
                text: 'Выберите камень, ножницы или бумагу.',
                en: 'Choose Rock, Paper or Scissors.'
            },
            add_items: {
                text: 'Внести предметы',
                en: 'Add items'
            },
            choose_items: {
                text: 'Внести выбранные предметы',
                en: 'Add selected items'
            }
        },
        coinflip: {
            page_name: {
                text: 'Монетка',
                en: 'CoinFlip'
            },
            table: {
                players: {
                    text: 'Игроки',
                    en: 'Players'
                },
                items: {
                    text: 'Предметы',
                    en: 'Items'
                },
                worth: {
                    text: 'Стоимость',
                    en: 'Worth'
                },
                join: {
                    text: 'Войти',
                    en: 'Join'
                },
                view: {
                    text: 'Просмотр',
                    en: 'View'
                }
            },
            start_game: {
                text: 'Начать игру',
                en: 'Start'
            },
            winner: {
                text: 'Победитель',
                en: 'Winner'
            },
            add_items: {
                text: 'Внести предметы',
                en: 'Add items'
            },
            choose_items: {
                text: 'Внести выбранные предметы',
                en: 'Add selected items'
            }
        },
        double: {
            page_name: {
                text: 'Дабл',
                en: 'Double'
            },
            previous_numbers: {
                text: 'Предыдущие числа:',
                en: 'Previous numbers:'
            },
            rolling_in: {
                text: 'Розыгрыш через:',
                en: 'Rolling in'
            },
            rolling: {
                text: 'Идет розыгрыш',
                en: 'Rolling'
            },
            balance: {
                text: 'Баланс:',
                en: 'Balance:'
            },
            fill_up_balance: {
                text: 'Пополнить баланс',
                en: 'Fill up balance'
            },
            choose_items: {
                text: 'Обменять',
                en: 'Sell'
            },
            connection_lost: {
                text: '<div class="loading-dots" style="text-align: left;margin-left: 10px;">Соединение потеряно</div>',
                en: '<div class="loading-dots" style="text-align: left;margin-left: 10px;">Connection lost</div>'
            },
            chat: {
                top: {
                    text: 'Чат',
                    en: 'Chat'
                },
                welcome: {
                    text: 'Добро пожаловать в чат!',
                    en: 'Welcome to chat!'
                },
                send: {
                    text: 'Отправить',
                    en: 'Send'
                }
            }
        },
        crash: {
            page_name: {
                text: 'Краш',
                en: 'Crash'
            },
            next_round_in: {
                text: 'Следующий раунд через',
                en: 'Next round in'
            },
            seconds: {
                text: 'сек',
                en: 's'
            },
            balance: {
                text: 'Баланс:',
                en: 'Balance:'
            },
            bet: {
                place: {
                    text: 'Сделать ставку',
                    en: 'Place bet'
                },
                cash_out: {
                    text: 'Забрать<br>@ ${1} <i class="double-icon"></i>',
                    en: 'Cash Out<br>@ ${1} <i class="double-icon"></i>'
                },
                betting: {
                    text: 'Ставим...',
                    en: 'Betting...'
                }
            },
            tabs: {
                bets: {
                    text: 'Ставки',
                    en: 'Bets'
                },
                history: {
                    text: 'История',
                    en: 'History'
                },
                top: {
                    text: 'Топ',
                    en: 'Top'
                }
            },
            table: {
                nick: {
                    text: 'Ник',
                    en: 'Nickname'
                },
                bet: {
                    text: 'Ставка',
                    en: 'Bet'
                },
                profit: {
                    text: 'Выгода',
                    en: 'Profit'
                }
            },
            chat: {
                top: {
                    text: 'Чат',
                    en: 'Chat'
                },
                welcome: {
                    text: 'Добро пожаловать в чат!',
                    en: 'Welcome to chat!'
                },
                send: {
                    text: 'Отправить',
                    en: 'Send'
                }
            }
        },
        dice: {
            page_name: {
                text: 'Кости',
                en: 'Dice'
            },
            roll_dice: {
                text: 'Кости',
                en: 'Roll dice'
            },
            how_to_play: {
                text: 'Как играть',
                en: 'How to play'
            },
            how_to_play_modal: {
                title: {
                    text: 'Как играть',
                    en: 'How to play'
                },
                body: {
                    text: '<p>Перед стартом вы можете поменять условие выигрыша, множитель и шансы на победу.</p> \
                        <p>Затем вы указываете размер вашей ставки и бросаете кость.</p> \
                        <p>После броска генерируется случайное число и, если это число удовлетворяет условию, игрок забирает свою ставку умноженную на множитель.</p> \
                        <p>Максимальная ставка - 50 000</p>',
                    en: '<p>Before you start the game you can change roll determiner, payout and win chance.</p> \
                        <p>Then you input a bet amount and tap on the "Roll dice" button.</p> \
                        <p>When you click on "Roll dice" button it will generate a random number. And if this number is satisfies the condition you will get your bet multiply by payout.</p>'
                },
                close: {
                    text: 'Закрыть',
                    en: 'Close'
                }
            },
            game: {
                to_win_roll: {
                    text: 'Условие',
                    en: 'To Win Roll'
                },
                payout: {
                    text: 'Множитель',
                    en: 'Payout'
                },
                win_chance: {
                    text: 'Шансы',
                    en: 'Win Chance'
                },
                bet: {
                    text: 'Ставка',
                    en: 'Bet'
                },
                roll_dice: {
                    text: 'Бросить кость',
                    en: 'Roll dice'
                },
                end_roll: {
                    text: 'Выпало ${1}. Бросить еще раз?',
                    en: 'Rolled ${1}. Roll again?'
                }
            },
            history: {
                history_title: {
                    text: 'История',
                    en: 'History'
                },
                bet: {
                    text: 'Ставка',
                    en: 'Bet'
                },
                payout: {
                    text: 'Множитель',
                    en: 'Payout'
                },
                win_condition: {
                    text: 'Условие',
                    en: 'Condition'
                },
                roll: {
                    text: 'Выпало',
                    en: 'Roll'
                },
                profit: {
                    text: 'Выгода',
                    en: 'Profit'
                }
            }
        },
        minesweeper: {
            page_name: {
                text: 'Сапер',
                en: 'Minesweeper'
            },
            game: {
                bet: {
                    $placeholder: {
                        text: 'Ставка',
                        en: 'Bet'
                    }
                },
                mines: {
                    $placeholder: {
                        text: 'Кол-во мин',
                        en: 'Mines Amount'
                    }
                },
                start_game: {
                    text: 'Начать',
                    en: 'Confirm'
                },
                next: {
                    text: 'Следующий ход:',
                    en: 'Next:'
                },
                total: {
                    text: 'Всего:',
                    en: 'Total:'
                },
                cashout: {
                    text: 'Забрать',
                    en: 'Cashout'
                },
                new_game: {
                    text: 'Новая игра',
                    en: 'New game'
                }
            },
            history: {
                text: 'История',
                en: 'History'
            }
        },
        inventory: {
            page_name: {
                text: 'Инвентарь',
                en: 'Inventory'
            },
            weapon_info: {
                price: {
                    text: 'Цена',
                    en: 'Price'
                },
                quality: {
                    text: 'Качество',
                    en: 'Quality'
                },
                trade_up_contract: {
                    text: 'Контракт обмена',
                    en: 'Trade Up Contract'
                },
                sell: {
                    text: 'Продать',
                    en: 'Sell'
                },
                rename: {
                    text: 'Переименовать ${1}'
                }
            },
            trade_up_contract: {
                close: {
                    text: 'Закрыть контракт',
                    en: 'Close contract'
                },
                proceed: {
                    text: 'Обмен...',
                    en: 'Proceed...'
                },
                contract_error: {
                    title: {
                        text: 'Ошибка',
                        en: 'Error'
                    },
                    message: {
                        text: 'Попробуйте другое оружие',
                        en: 'Try another weapon'
                    }
                },
            },
            sell_error: {
                text: 'Что-то не так с ценой',
                en: 'Something wrong with weapon price'
            },
            statistic: {
                worth: {
                    text: 'Сумма:',
                    en: 'Worth:'
                },
                count: {
                    text: 'Предметов:',
                    en: 'Count:'
                }
            },
            sort: {
                special: {
                    text: ["Все типы", "Новое", "StatTrak", "Не StatTrak", "Сувениры", "Не сувениры", "Обычное"],
                    en: ["All types", "New", "StatTrak", "Not StatTrak", "Souvenir", "Not Souvenir", "Normal"]
                },
                types: {
                    text: ["Все оружия", "Пистолеты", "Винтовки", "Снайперские винтовки", "SMG", "Дробовики", "Пулеметы", "Ножи", "Перчатки"],
                    en: ["All weapons", "Pistols", "Rifles", "Sniper rifles", "SMGs", "Shotguns", "Machineguns", "Knives", "Gloves"]
                },
                quality: {
                    text: ["Все качества", "Белое", "Светло-синее", "Синее", "Фиолетовое", "Розовое", "Красное", "Золотое"],
                    en: ["All qualities", "White", "Light-blue", "Blue", "Purple", "Pink", "Red", "Gold"]
                }
            }
        },
        marketplace: {
            page_name: {
                text: 'Магазин',
                en: 'Market'
            },
            weapon_info: {
                price: {
                    text: 'Цена',
                    en: 'Price'
                },
                quality: {
                    text: 'Качество',
                    en: 'Quality'
                },
                buy: {
                    text: 'Купить:',
                    en: 'Buy:'
                },
                not_for_sale: {
                    text: 'Это предмет не продается',
                    en: 'This item is not for sale'
                }
            },
        },
        chat: {
            page_name: {
                text: 'Чат',
                en: 'Chat'
            },
            login: {
                sign_in: {
                    text: 'Войти',
                    en: 'Sign in'
                },
                register: {
                    text: 'Регистрация',
                    en: 'Register'
                },
                forgot_pass: {
                    text: 'Забыли пароль?',
                    en: 'Forgot password?'
                },
                have_ban: {
                    text: 'У вас есть бан. Вы не можете создать новый аккаунт',
                    en: 'You have ban. You can\'t create new account.'
                }
            },
            banlist: {
                text: 'Баны',
                en: 'Banlist'
            },
            send_message: {
                text: 'Отправить',
                en: 'Send'
            },
            moderator: {
                delete_msg: {
                    title: {
                        text: 'Удалить сообщение',
                        en: 'Delete message'
                    },
                    message: {
                        text: 'Вы действительно хотите удалить сообщение?',
                        en: 'Are you sure that you want to delete this message?'
                    }
                },
                
            }
        },
        banlist: {
            page_name: {
                text: 'Список банов',
                en: 'Banlist'
            }
        },
        profile: {
            page_name: {
                text: 'Профиль',
                en: 'Profile'
            },
            follow: {
                follow: {
                    text: 'Подписаться',
                },
                unfollow: {
                    text: 'Отписаться'
                }
            },
            stats: {
                level: {
                    text: 'Уровень',
                    en: 'Level'
                },
                inventory: {
                    text: 'Инвентарь',
                    en: 'Inventory'
                },
                followers: {
                    text: 'Подписчиков'
                },
                reputation: {
                    text: 'Репутация',
                    en: 'Reputation'
                }
            },
            user_cases: {
                text: 'Показать кейсы пользователя',
                en: 'Show user cases'
            },
            text_field: {
                text: 'Что нового?',
                en: 'Sup?'
            },
            moderator: {
                chat_ban: {
                    text: 'Бан чата',
                    en: 'Chat ban'
                },
                trade_ban: {
                    text: 'Бан обмена',
                    en: 'Trade ban'
                },
                no_ban: {
                    text: 'Бана нет',
                    en: 'No ban.'
                },
                ban_modal: {
                    title: {
                        text: 'Причина бана',
                        en: 'Ban reason'
                    },
                    reasons: {
                        spam: {
                            text: 'Спам',
                            en: 'Spam'
                        },
                        cheats: {
                            text: 'Читы',
                            en: 'Cheats'
                        },
                        insults: {
                            text: 'Оскорбления',
                            en: 'Insults'
                        },
                        scam: {
                            text: 'Мошенничество',
                            en: 'Scam'
                        },
                        adult_img: {
                            text: '18+ изображения',
                            en: '18+ pictures'
                        },
                        other: {
                            text: 'Другое',
                            en: 'Other'
                        },
                    }
                }
            },
            send_post: {
                text: 'Отправить',
                en: 'Send'
            },
            delete_trade_confirm: {
                confirm_text: {
                    text: 'Вы действительно хотите удалить всю историю обмена с этим игроком?',
                    en: 'Do you really want to delete all trades with this user?'
                },
                yes: {
                    text: 'Да',
                    en: 'Yes'
                },
                no: {
                    text: 'Нет',
                    en: 'No'
                }
            },
            exchange: {
                title: {
                    text: 'Обмен',
                    en: 'Trade'
                },
                exchange_offers: {
                    text: 'Предложения обмена: ',
                    en: 'Exchange offers: '
                },
                status: {
                    ready: {
                        text: 'Готов',
                        en: 'Ready'
                    },
                    not_ready: {
                        text: 'Не готов',
                        en: 'Not ready'
                    },
                    checkbox: {
                        text: 'Отметьте, когда будете готовы к обмену.',
                        en: 'Check this box when ready to trade.'
                    },
                    gift: {
                        text: 'Это подарок',
                        en: 'It\'s a gift.'
                    }
                },
                your_offer: {
                    main: {
                        text: 'Ваши предметы',
                        en: 'Your offerings'
                    },
                    info: {
                        text: 'Эти предметы вы утратите после обмена',
                        en: 'These are the items you will lose in the trade.'
                    }
                },
                other_offer: {
                    main: {
                        text: 'Предметы другого игрока',
                        en: 'Other player offerings'
                    },
                    info: {
                        text: 'Эти предметы вы получите после обмена',
                        en: 'These are the items you will receive in the trade.'
                    }
                },
                buttons: {
                    change_offer: {
                        text: 'Добавить своих предметов',
                        en: 'Change your offer'
                    },
                    cancel_trade: {
                        text: 'Отменить обмен',
                        en: 'Cancel trade'
                    },
                    make_trade: {
                        text: 'Совершить обмен',
                        en: 'Make trade'
                    },
                    back: {
                        text: 'Назад',
                        en: 'Back'
                    },
                    add_items: {
                        text: 'Добавить предметы',
                        en: 'Add items'
                    }
                },
                your_inventory: {
                    text: 'Ваш инвентарь',
                    en: 'Your inventory'
                },
                their_inventory: {
                    text: 'Его инвентарь',
                    en: 'Their inventory'
                },
                summary: {
                    text: 'Итого',
                    en: 'Summary'
                },
                watch_inventory_wip: {
                    text: 'Просмотр чужого инвентаря в разработке. Отправьте предложение обмена и подождите, пока другой игрок добавит свои предметы.',
                    en: 'Send trade and wait for other player add something.'
                },
                navigation: {
                    back: {
                        text: 'Назад',
                        en: 'Back'
                    },
                    next: {
                        text: 'Вперед',
                        en: 'Next'
                    },
                    send_trade: {
                        text: 'Отправить обмен',
                        en: 'Send trade'
                    }
                },
                notification: {
                    title: {
                        text: 'Обмен',
                        en: 'Trade'
                    },
                    trade_send: {
                        text: 'Предложение обмена отправлено',
                        en: 'Trade offer successful sended'
                    },
                    to_many_weapons: {
                        text: 'Максимальное число предметов: ${1}.',
                        en: 'The maximum number of items: ${1}'
                    }
                }
            }
        },
        statistic: {
            page_name: {
                text: 'Статистика',
                en: 'Statistic'
            },
            total_opened: {
                text: 'Количество открытых кейсов',
                en: 'Total cases opened'
            },
            white: {
                text: 'Белые',
                en: 'White'
            },
            light_blue: {
                text: 'Светло-синие',
                en: 'Light-blue'
            },
            blue: {
                text: 'Синие',
                en: 'Blue'
            },
            purpule: {
                text: 'Фиолетовые',
                en: 'Purpule'
            },
            pink: {
                text: 'Розовые',
                en: 'Pink'
            },
            red: {
                text: 'Красные',
                en: 'Red'
            },
            gold: {
                text: 'Ножи/Перчатки',
                en: 'Knives/Gloves'
            },
            contracts: {
                text: 'Контракты обмена',
                en: 'Trade up contracts'
            },
            jackpot_win_lose: {
                text: 'Рулетка выиграно/проиграно',
                en: 'Jackpot win/lose'
            },
            jackpot_max: {
                text: 'Максимальный выигрыш в рулетке',
                en: 'Jackpot max money won'
            },
            rps_win_lose: {
                text: 'Камень-ножницы-бумага выиграно/проиграно',
                en: 'Rock-Paper-Scissors win/lose'
            },
            coinflip_win_lose: {
                text: 'Монетка выиграно/проиграно',
                en: 'Coinflip win/lose'
            },
            coinflip_max: {
                text: 'Максимальный выигрыш в монетке',
                en: 'Coinflip max money won'
            },
            double_win_lose: {
                text: 'Дабл выиграно/проиграно',
                en: 'Double win/lose'
            }
        },
        faq: {
            page_name: {
                text: 'FAQ',
                en: 'FAQ'
            },
            how_to_play_jackpot: {
                title: {
                    text: 'Как играть в рулетку?',
                    en: 'How to play Jackpot?'
                },
                info: {
                    text: 'Максимальное число предметов, которые можно добавить: 15.<br> Максимальная стоимость - неограничена.<br>Игра начинается как только набирается 50 предметов.<br>Если вы добавили предметы и вышли из рулетки - предметы пропадают.',
                    en: 'The max number of weapons that you can add: 15.<br>Maximum price is unlimited.<br>The game will begin after 50 weapons are collected.<br>If you add weapons and close the jackpot, weapons will disappear.'
                }
            },
            why_no_price: {
                title: {
                    text: 'Почему цена предмета $0?',
                    en: 'Why weapon price is $0?'
                },
                info: {
                    text: 'Цена предмета берется из базы. Если в базе нет цены, берётся с Торговой площадки стима. Если и там нет, тогда $0.<br>Если в стиме появился этот предмет, а у вас в инвентаре до сих пор цена $0 - откройте описание предмета, подождите пока загрузиться цена, закройте описание предмета и перезайдите в инвентарь.',
                    en: 'Weapons prices are taken from the database. If there are no prices for current weapon, then price is taken from the Steam Market. If there is no price as well, it counts as $0. <br> When the weapon appears in market, open the weapon info in inventory, wait until the price is loaded, reopen inventory.'
                }
            },
            how_to_exchange: {
                 title: {
                    text: 'Как обмениваться предметами?',
                    en: 'How to exchange?'
                },
                info: {
                    text: 'Для начала необходимо включить обмен в настройках.<br><b>Как отправить предложение обмена</b><br> \
                        <ol> \
                            <li>Откройте профиль другого игрока (он тоже должен включить обмен в настройках)</li> \
                            <li>Нажмите на значок обмена (<i class="fa fa-exchange" aria-hidden="true"></i>)</li> \
                            <li>Выберите оружие, которое хотите отправить игроку и нажмите "Далее"</li> \
                            <li><s>Выберите оружие, которое хотите получить от игрока и нажмите "Далее"</s> (На данный момен просмотр инвентаря другого игрока невозможен)</li> \
                            <li>Если вы хотите подарить эти предметы (и ничего не получить взамен), поставьте галочку напротив строки "Это подарок".</li> \
                            <li>Нажмите кнопку "Отправить обмен"</li> \
                        </ol> \
                        <b>Как получить предметы</b> \
                        <ol> \
                            <li>Откройте свой профиль</li> \
                            <li>Нажмите на значок обмена (<i class="fa fa-exchange" aria-hidden="true"></i>)</li> \
                            <li>Из списка выберите игрока, с которым хотите обменяться предметами (если нажать на его аватарку, можно открыть его профиль)</li> \
                            <li>Выберите нужный трейд</li> \
                            <li>Добавьте свои предметы</li> \
                            <li>Когда будете готовы, поставьте галочку напротив поля "Отметьте, когда будете готовы к обмену"</li> \
                            <li>Подождите пока другой игрок тоже поставит галочку и нажмите кнопку "Совершить обмен". Или её может нажать другой игрок.</li> \
                        </ol> \
                        Если другой игрок нажал кнопку "Совершить обмен", когда вы были не в окне обмена, откройте этот трейд, чтобы получить предметы.',
                    en: 'First of all, you need to enable "Exchange" in settings.<br><b>How to send the trade offer</b><br><ol><li>Open another player profile</li><li>Press on the exchange icon (<i class="fa fa-exchange" aria-hidden="true"></i>)</li><li>Select the weapons that you want to send and press on the "Next" button</li><li><s>Select the weapons that you want to get from player</s> (WIP)</li><li>If you want to send weapons as a gift then check "It\'s a gift" checkbox</li><li>Press on the "Send trade" button</li></ol><b>How to get weapons</b><ol><li>Open your profile</li><li>Press on the exchange icon (<i class="fa fa-exchange" aria-hidden="true"></i>)</li><li>Select the player that send the offer to you</li><li>Select the offer</li><li>Change your offer if you want</li><li>Check the "Check this box when ready to trade." checkbox</li><li>Wait until another player check this checkbox too and press on the "Make trade" button. Or another player can press it</li></ol>If another player pressed the "Make trade" button when you was offline then open this trade to get your weapons.'
                }
            },
            how_to_level_up: {
                title: {
                    text: 'Как поднять уровень?',
                    en: 'How to level up?'
                },
                info: {
                    text: 'Чтобы повысить ранг, нужно заработать очки. Очки, даются за следующие действия:<ul><li>Открыть приложение — ${1} очков (награда даётся раз в день)</li><li>Открыть кейс — ${2} очко</li><li>Победить в мини-игре — ${3} очка</li></ul>',
                    en: 'For increasing your level you need points. Points are given for the following steps:<ul> \
                        <li>Open the app - ${1} points (award is given once a day)</li> \
                        <li>Open one case - ${2} point</li> \
                        <li>Won in the mini-game - ${3} points</li> \
                    </li></ul>'
                }
            },
            found_bug: {
                title: {
                    text: 'Я нашел ошибку, что делать?',
                    en: 'I found a bug what should I do?'
                },
                info: {
                    text: 'Срочно пишите на почту: <b>kurtukovvlad@gmail.com</b>',
                    en: 'You can contact me via email: kurtukovvlad@gmail.com'
                }
            }
        },
        updates: {
            page_name: {
                text: 'Обновления',
                en: 'Updates'
            }
        },
        settings: {
            page_name: {
                text: 'Настройки',
                en: 'Settings'
            },
            profile: {
                group_title: {
                    text: 'Профиль',
                    en: 'Profile'
                },
                nick: {
                    text: 'Ваше имя',
                    en: 'Your name'
                },
                avatar: {
                    text: 'Аватарка',
                    en: 'Avatar'
                }
            },
            beta: {
                group_title: {
                    text: 'Экспериментальные функции',
                    en: 'Beta'
                },
                exchange: {
                    text: 'Обмен оружием с игроками',
                    en: 'Exchange'
                }
            },
            interface: {
                group_title: {
                    text: 'Интерфейс',
                    en: 'Interface'
                },
                language: {
                    text: 'Язык',
                    en: 'Language'
                },
                sound: {
                    text: 'Звуки',
                    en: 'Sound'
                },
                fast_drop: {
                    text: 'Быстрый дроп с кейсов',
                    en: 'Fast drop (x2)'
                }
            },
            promocode: {
                text: 'Активировать промокод',
                en: 'Activate a promo code'
            },
            reset: {
                text: 'Полный сброс',
                en: 'Full reset'
            },
            save: {
                text: 'Сохранить',
                en: 'Save'
            },
            promo_modal: {
                enter: {
                    text: 'Введите промокод:',
                    en: 'Enter promocode:'
                },
                activate: {
                    text: 'Активировать',
                    en: 'Activate'
                },
                close: {
                    text: 'Отмена',
                    en: 'Close'
                }
            },
            notification: {
                title: {
                    text: 'Статус',
                    en: 'Status'
                },
                saved: {
                    text: 'Сохранено',
                    en: 'Saved'
                },
                reset_done: {
                    text: 'Очищено',
                    en: 'Done'
                },
                reset_confirm_title: {
                    text: 'Полный сброс',
                    en: 'Full Reset'
                },
                reset_confirm: {
                    text: 'Вы уверены, что хотите очистить инвентарь и сбросить статистику?',
                    en: 'All weapons will be deleted. Statistics will be reset. Are you sure?'
                },
                invalid_nick_title: {
                    text: 'Ошибка',
                    en: 'Error'
                },
                invalid_nick: {
                    text: 'В имени могут быть только буквы и цифры.',
                    en: 'Wrong name. Only letters and numbers are available.'
                }
            }
        },
        about: {
            page_name: {
                text: 'О программе',
                en: 'About'
            },
            main_developer: {
                text: 'Главный разработчик',
                en: 'Main developer'
            },
            info: {
                text: 'Если Вы обнаружили ошибки, или у Вас есть предложение, напишите на почту.<br>Если хотите поблагодарить разработчика, можете подарить что-нибудь в стиме :)<br>Не забудьте поставить оценку в маркете ^_^',
                en: 'If you found some bugs or you have a suggestion you can write me an email.<br>If you want to thank the developer you can send something in Steam :)<br>Do not forget to rate the app in the Play Market ^_^'
            },
            special_thanks: {
                text: 'Особая благодарность',
                en: 'Special Thanks'
            },
            copyright: {
                text: 'Авторские права',
                en: 'Copyright'
            },
            copyright_info: {
                text: 'Вся информация взята из открытых источников. Если что-либо в приложении нарушает ваши авторские права, свяжитесь со мной.',
                en: 'All information is taken from public sources. If anything in the application infringes your copyright, please contact me.'
            }
        },
        apps: {
            page_name: {
                text: 'Другие приложения',
                en: 'Other apps'
            }
        },
        other: {
            souvenir: {
                text: 'Сувенир',
                en: 'Souvenir'
            },
            new_version: {
                new_version: {
                    text: 'Доступна новая версия приложения.',
                    en: 'New version of the app is available.'
                },
                update: {
                    text: 'Обновить',
                    en: 'Update'
                },
                later: {
                    text: 'Позже',
                    en: 'Later'
                }
            },
            daily_reward: {
                title: {
                    text: 'Награда!',
                    en: 'Reward!'
                },
                message: {
                    text: 'Вы получили ежедневную награду!<br>+${1} очков ранга | +${2} очков дабла.',
                    en: 'You get daily reward!<br>+${1} EXP | +${2} double points.'
                }
            },
            sum_text: {
                text: 'Сумма: ',
                en: 'Worth: '
            },
            promocode: {
                wrong: {
                    text: 'Неправильный промокод',
                    en: 'Wrong promo code.'
                },
                used: {
                    text: 'Вы уже использовали этот код',
                    en: 'You already used this code.'
                }
            },
            empty_inventory: {
                text: 'Инвентарь пуст. Чтобы пополнить его, <a href="cases.html">откройте пару кейсов.</a>',
                en: 'Inventory is empty. <a href="cases.html">Open some cases to fill it.</a>'
            },
            ban: {
                wrong_ban: {
                    text: 'Если вы считаете, что получили бан по ошибке, напишите на почту kurtukovvlad@gmail.com',
                    en: 'If you were banned by a mistake, write to email kurtukovvlad@gmail.com'
                }
            }
        }
    }
}