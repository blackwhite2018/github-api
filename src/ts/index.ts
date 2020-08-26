import { Item, Response } from './interface/interfaces';
import '../css/main.css';

const debounce = (fn: Function, ms: number): Function => {
  let is_debounsed: boolean = false;
  return (...rest: Array<any>): void => {
    if (is_debounsed) return;
    fn.apply(debounce, rest);
    is_debounsed = true;
    setTimeout(() => {
      is_debounsed = false;
    }, ms);
  };
};

const handleAutocompleteItem = (item: Item): string => {
  const { name, language, stargazers_count } = item;
  const tmp = `
    <div class="repositories__item">
      <div class="repositories__container">
        <div class="repositories__name">Name: ${name}</div>
        <div class="repositories__language">Owner: ${language}</div>
        <div class="repositories__stars">Stars: ${stargazers_count}</div>
      </div>
      <button type="button" aria-label="btn remove list item" class="list-item__btn-remove">remove</button>
    </div>
  `;
  return tmp;
};

const createListAutocompleteItem = (item: Item): HTMLElement => {
  const { name } = item;
  const listItem: HTMLDivElement = document.createElement('div');
  listItem.textContent = name;
  listItem.addEventListener('click', () => {
    const listContainer: HTMLDivElement | null = document.querySelector('.repositories');
    if (listContainer) {
      const inputSearch: HTMLInputElement | null = document.querySelector('.form__search');
      if (inputSearch) {
        inputSearch.value = '';
        const autocompleteContainer: HTMLDivElement | null = document.querySelector('.autocomplete-container');
        if (autocompleteContainer) autocompleteContainer.innerHTML = '';
      }
      listContainer.innerHTML += handleAutocompleteItem(item);
    }
  });
  return listItem;
};

const createListAutocomplete = (items: Array<Item>): Array<HTMLElement> => {
  const listAutocomplete: Array<HTMLElement> = items.reduce((acc: Array<HTMLElement>, item: Item): Array<
    HTMLElement
  > => {
    return [...acc, createListAutocompleteItem(item)];
  }, []);
  return listAutocomplete;
};

const fetchData = async (url: string): Promise<Response | null> => {
  try {
    const response = await fetch(url);
    const data: Response = await response.json();
    return data;
  } catch (e) {
    console.error(e.message);
    return null;
  }
};

const loadDataForComplete = async (stringQuery: string): Promise<void> => {
  const data: Response | null = await fetchData(
    `https://api.github.com/search/repositories?q=${stringQuery}&per_page=5`
  );

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

const handleChangeSearchInput = (evt: MouseEvent): void => {
  const searchInput: any | null = evt?.target;
  if (searchInput) {
    const debounceFn = debounce(loadDataForComplete, 700);
    debounceFn(searchInput.value);
  }
};

const entry = async (count: number): Promise<void> => {
  if (count > 0) {
    const searchInput: any = document.querySelector('.form__search');
    if (searchInput) {
      const listContainer: HTMLDivElement | null = document.querySelector('.repositories');
      if (listContainer) {
        listContainer.addEventListener('click', (evt: MouseEvent) => {
          const { target }: any = evt;
          if (target) {
            if (target.closest('.list-item__btn-remove')) {
              target.parentElement.parentElement.remove();
            }
          }
        });
        searchInput.addEventListener('input', handleChangeSearchInput);
      }
    }
  }
};

try {
  entry(5);
} catch (error) {
  console.error(error);
}
