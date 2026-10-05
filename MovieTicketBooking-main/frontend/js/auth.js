const loginForm =
    document.getElementById(
        "loginForm"
    );


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document.getElementById(
                    "email"
                ).value;


            const password =
                document.getElementById(
                    "password"
                ).value;


            try {

                const response =
                    await loginUser({
                        email: email,
                        password: password
                    });


                localStorage.setItem(
                    "token",
                    response.token
                );


                localStorage.setItem(
                    "userId",
                    response.userId
                );


                localStorage.setItem(
                    "userName",
                    response.name || ""
                );


                alert(
                    "Login successful!"
                );


                window.location.href =
                    "movies.html";

            }

            catch (error) {

                console.error(error);

                alert(
                    "Login failed."
                );

            }

        }
    );

}


const registerForm =
    document.getElementById(
        "registerForm"
    );


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document.getElementById(
                    "name"
                ).value;


            const email =
                document.getElementById(
                    "registerEmail"
                ).value;


            const password =
                document.getElementById(
                    "registerPassword"
                ).value;


            try {

                await registerUser({

                    name: name,

                    email: email,

                    password: password

                });


                alert(
                    "Registration successful!"
                );


                window.location.href =
                    "login.html";

            }

            catch (error) {

                console.error(error);

                alert(
                    "Registration failed."
                );

            }

        }
    );

}