import { Item, Response } from './interface/interfaces';
import './../css/main.css';

const debounce: (fn: Function, ms: number) => Function = function (fn: Function, ms: number): Function {
  let is_debounsed: boolean = false;
  return (...rest: Array<any>): void => {
    if (is_debounsed) return;
    fn.apply(debounce, rest);
    is_debounsed = true;
    setTimeout(() => is_debounsed = false, ms);
  }
};

const handleRemoveItem: (evt: MouseEvent) => any = (evt: MouseEvent): any => {
  const elem: any | null = evt?.target;
  if (elem)
    elem?.parentElement.remove();
};

const createListItem: Function = (name: string, language: string, stargazersCount: number): HTMLElement => {
  const listItem: HTMLDivElement = document.createElement('div');
  listItem.classList.add('repositories__item');
  const listItemBox: HTMLDivElement = document.createElement('div');
  listItemBox.classList.add('repositories__container');
  const listItemName: HTMLDivElement = document.createElement('div');
  listItemName.classList.add('repositories__name');
  listItemName.textContent = `Name: ${name}`;
  listItemBox.appendChild(listItemName);
  const listItemLanguage: HTMLDivElement = document.createElement('div');
  listItemLanguage.classList.add('repositories__language');
  listItemLanguage.textContent = `Owner: ${language}`;
  listItemBox.appendChild(listItemLanguage);
  const listItemStargazersCount: HTMLDivElement = document.createElement('div');
  listItemStargazersCount.classList.add('repositories__stars');
  listItemStargazersCount.textContent = `Stars: ${stargazersCount}`;
  listItemBox.appendChild(listItemStargazersCount);
  const listItemBtnRemove: HTMLButtonElement = document.createElement('button');
  listItemBtnRemove.setAttribute('type', 'button');
  listItemBtnRemove.setAttribute('aria-label', 'btn remove list item');
  listItemBtnRemove.classList.add('list-item__btn-remove');
  listItemBtnRemove.textContent = 'remove';
  listItemBtnRemove.addEventListener('click', handleRemoveItem);
  listItem.appendChild(listItemBox);
  listItem.appendChild(listItemBtnRemove);
  return listItem;
};

const handleAutocompleteItem: (item: Item) => HTMLElement = (item: Item): HTMLElement => {
  const { name, language, stargazers_count } = item;
  return createListItem(name, language, stargazers_count);
};

const createListAutocompleteItem: (item: Item) => HTMLElement = (item: Item): HTMLElement => {
  const { name } = item;
  const listItem: HTMLDivElement = document.createElement('div');
  listItem.textContent = name;
  listItem.addEventListener('click', (evt: MouseEvent) => {
    const listContainer: HTMLDivElement | null = document.querySelector('.repositories');
    if (listContainer) {
      const inputSearch: HTMLInputElement | null = document.querySelector('.form__search');
      if (inputSearch) {
        inputSearch.value = '';
        const autocompleteContainer: HTMLDivElement | null = document.querySelector('.autocomplete-container');
        if (autocompleteContainer)
          autocompleteContainer.innerHTML = '';
      }
      listContainer.appendChild(handleAutocompleteItem(item));
    }
  });
  return listItem;
};

const createListAutocomplete: (items: Array<Item>) => Array<HTMLElement> = (items: Array<Item>): Array<HTMLElement> => {
  const listAutocomplete: Array<HTMLElement> = items.reduce((acc: Array<HTMLElement>, item: Item): Array<HTMLElement> => {
    return [...acc, createListAutocompleteItem(item)];
  }, []);
  return listAutocomplete;
};

const fetchData: Function = async (url: string) => {
  try {
    const response = await fetch(url);

    try {
      return await response.json();
    } catch (e) {
      console.error("incorrect json");
      return null;
    }
  } catch (e) {
    console.error("fetch error");
    return null;
  }
};

const loadDataForComplete: (stringQuery: string) => void = async (stringQuery: string) => {
  const data: Response | null = await fetchData(`https://api.github.com/search/repositories?q=${stringQuery}&per_page=5`);

  if (data?.items) {
    const autocompleteContainer: HTMLElement | null = document.querySelector('.autocomplete-container');
    if (autocompleteContainer) {
      autocompleteContainer.remove();
      const formContainer: HTMLDivElement | null = document.querySelector('.form-container');
      if (formContainer) {
        const newAutocompleteContainer: HTMLDivElement = document.createElement('div');
        newAutocompleteContainer.classList.add('autocomplete-container');
        formContainer.appendChild(newAutocompleteContainer);
        const autocompleteItems: HTMLElement[] = createListAutocomplete(data.items);
        autocompleteItems.forEach((item: HTMLElement) => {
          newAutocompleteContainer.appendChild(item);
        });
      }
    }
  }
};

const handleChangeSearchInput: (evt: MouseEvent) => void = (evt: MouseEvent): void => {
  const searchInput: any | null = evt?.target;
  if (searchInput) {
    const debounceFn = debounce(loadDataForComplete, 700);
    debounceFn(searchInput.value);
  }
};

const entry: (nbr: number) => void = async (count: number) => {
  if (count > 0) {
    const searchInput: any = document.querySelector('.form__search');
    if (searchInput) {
      searchInput.addEventListener('input', handleChangeSearchInput);
    }
  }
};

try {
  entry(5);
} catch (error) {
  console.error(error);
}
