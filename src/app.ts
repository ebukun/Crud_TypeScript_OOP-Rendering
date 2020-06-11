//autobind decorator
function autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };
  return adjDescriptor;
}

interface ListData {
  id: number;
  textlist: string;
}

class ListInput {
  formEL: HTMLFormElement;
  InputEL: HTMLInputElement;
  formStatus: string = "add";
  InputId: string = "";

  set InputIdTag(value: string) {
    this.InputId = value;
  }

  get InputIdTag() {
    return this.InputId;
  }

  set formStatusTag(value: string) {
    this.formStatus = value;
  }

  constructor() {
    this.formEL = <HTMLFormElement>document.querySelector("form");
    this.InputEL = <HTMLInputElement>document.querySelector("input");

    this.configure();
  }

  configure() {
    this.formEL.addEventListener("submit", this.onSubmit);
  }

  @autobind
  private onSubmit(e: Event) {
    e.preventDefault();
    const input = this.InputEL.value;
    if (this.formStatus === "add" && input.length !== 0) {
      listState.addList(input);
    }
    if (this.formStatus === "update" && input !== "") {
      const updatelist: ListData = {
        id: +this.InputId,
        textlist: input,
      };
      listState.updateList(updatelist);
    }

    this.clear();
  }

  inputData() {
    return this.InputEL;
  }

  private clear() {
    this.InputEL.value = "";
  }
}

class List {
  constructor(public id: number, public textlist: string) {}
}

class ListState {
  listGroup: HTMLUListElement;
  btnAdd: HTMLButtonElement;
  private listArray: List[] = [];

  constructor() {
    this.listGroup = <HTMLUListElement>document.querySelector(".list-group");
    this.btnAdd = <HTMLButtonElement>document.querySelector(".btnAdd")!;
  }

  private listId() {
    const id = Math.floor(Math.random() * 10000);
    return id;
  }

  
  addList(list: string) {
    this.listGroup.innerHTML = "";
    const newList = {
      id: this.listId(),
      textlist: list,
    };
    this.listArray.unshift(newList);
    this.listGroup.className = "collection mx-20 lg:mx-64";
    this.showList();
  }

  updateList(list: ListData) {
    this.listArray.forEach((list_item) => {
      if (+list_item.id === +list.id) {
        list_item.textlist = list.textlist;
      }
    });

    let input = listInput.inputData();
    input.value = "";
    listInput.formStatusTag = "add";
    this.btnAdd.innerText = "Add";
    this.showList();
  }

  private showList() {
    this.listGroup.innerHTML = "";
    if (!this.listArray.length) {
      this.listGroup.className = "list-group";
    }
    for (const items of this.listArray) {
      this.listGroup.appendChild(createList.renderContent(items));
    }
  }

  @autobind
  deleteList(deleteButton: HTMLElement) {
    deleteButton.addEventListener("click", (e: any) => {
      if (e.target.classList.contains("delete")) {
        const item: HTMLElement = e.target.parentNode.parentNode.parentNode;
        this.listArray = this.listArray.filter((list) => +list.id !== +item.id);

        let input = listInput.inputData();
        if (input.value.length === 0) {
        } else {
          M.toast({ html: "Update list first!", displayLength: 700 });
        }
        this.showList();
      }
    });
  }

  @autobind
  editList(editButton: HTMLElement) {
    editButton.addEventListener("click", (e: any) => {
      if (e.target.classList.contains("edit")) {
        console.log("editing");
        const item = e.target.parentNode.parentNode;
        console.log(item.firstChild.innerText);
        const ul = e.target.parentNode.parentNode.parentNode;
        let input = listInput.inputData();
        input.value = item.firstChild.innerText;
        listInput.InputIdTag = ul.id;
        this.btnAdd.innerText = "Update";
        listInput.formStatusTag = "update";
      }
    });
  }
}

class CreateList {
  constructor() {}

  renderContent(list: ListData) {
    const { id, textlist } = list;
    const li = document.createElement("li");
    li.className = "collection-item";
    li.id = id.toString();
    const div = document.createElement("div");
    const a_text = document.createElement("a");
    const a_href = document.createElement("a");
    a_text.textContent = textlist;
    a_href.href = "#";
    a_href.setAttribute("class", "secondary-content");

    const deleteButton = document.createElement("i");
    deleteButton.className = "material-icons pr-4 delete";
    deleteButton.innerText = "delete";
    listState.deleteList(deleteButton);

    const editButton = document.createElement("i");
    editButton.className = "material-icons pr-4 edit";
    editButton.innerText = "edit";
    listState.editList(editButton);

    a_href.appendChild(deleteButton);
    a_href.appendChild(editButton);

    div.appendChild(a_text);
    div.appendChild(a_href);
    li.appendChild(div);

    return li;
  }
}

const createList = new CreateList();

const listInput = new ListInput();
const listState = new ListState();
