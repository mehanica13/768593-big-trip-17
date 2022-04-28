import AllElPresenter from './presenter/all-el-presenter.js';

const pageBodyElement = document.querySelector('.page-body');
const allElPresenter = new AllElPresenter();

allElPresenter.init(pageBodyElement);
