    [
      {
        "type": "choice",
        "additonActionOn": "rerol",
        "additionActionKey": 1,
        "actions": [
          {
            "type": "removePoints",
            "value": 50,
            "target": "current",
            "choiceMessage": "Вы потеряете 50 очков, в случае отказа от выполнения условий. Отказаться?"
          },
          {
            "type": "addPoints",
            "value": 50,
            "target": "current",
            "choiceMessage": "Вы получите 50 очков, в случае выполнения условий. Вы выполнили условия?"
          }
        ]
      }
    ]
