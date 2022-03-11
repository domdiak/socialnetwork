import { Registration } from "./registration";
import { Reset } from "./reset";
import { Login } from "./login";
import { BrowserRouter, Route } from "react-router-dom";

// export everyting without default and use curly brackets or just rely on export default and then incclude it in import
export default function Welcome() {
    return (
        <>
            <h1> Welcome</h1>
            <BrowserRouter>
                <Route exact path="/">
                    <Registration />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/reset">
                    <Reset />
                </Route>
            </BrowserRouter>
        </>
    );
}
