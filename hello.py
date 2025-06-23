dict_list = [
    {
        'name': 'Bob',
        'age': 12,
        'occupation': 'builder'
    },
    {
        'name': 'Konrad',
        'age': 26,
        'occupation': 'dev'
    },
    {
        'name': 'Maleah',
        'age': 25,
        'occupation': 'baddie'
    }
]


def find(name):
    for i in dict_list:
        if i['name'] == name:
            return i


print(find('Konrad'))
