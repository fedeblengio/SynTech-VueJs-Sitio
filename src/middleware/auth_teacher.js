export default function auth({ next, router }) {
  if (!localStorage.getItem('auth_token')) {
    return router.push({ name: 'login' });
  }
  let User = JSON.parse(window.atob(localStorage.getItem("auth_token")));
  if(User.ou == "Profesor"){
      return next();
  }

  return router.push({ name: 'home' });
}