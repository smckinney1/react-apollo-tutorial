import React from 'react';
import { Mutation } from 'react-apollo';
import { loader } from 'graphql.macro';

import useInputChange from '../hooks/useInputChange';
import { AUTH_TOKEN } from '../constants';

const SIGNUP_MUTATION = loader('../graphql/mutations/signup.graphql');
const LOGIN_MUTATION = loader('../graphql/mutations/login.graphql');

const Login = ({ history }) => {
  const [login, setLogin] = React.useState(false);
  const [input, handleInputChange] = useInputChange({
    email: '',
    name: '',
    password: '',
  });

  const confirm = async data => {
    const { token } = login ? data.login : data.signup;

    localStorage.setItem(AUTH_TOKEN, token);
    history.push('/');
  };

  return (
    <div>
      <h4 className="mv3">{login ? 'Login' : 'Sign Up'}</h4>
      <div className="flex flex-column">
        {!login && (
          <input
            type="text"
            name="name"
            placeholder="Your name"
            onChange={e => handleInputChange(e)}
            value={input.name}
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Your email address"
          onChange={e => handleInputChange(e)}
          value={input.email}
        />
        <input
          type="password"
          name="password"
          placeholder="Choose a safe password"
          onChange={e => handleInputChange(e)}
          value={input.password}
        />
      </div>
      <div className="flex mt3">
        <Mutation
          mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
          variables={input}
          onCompleted={data => confirm(data)}
        >
          {mutation => (
            <div className="pointer mr2 button" onClick={mutation}>
              {login ? 'login' : 'create account'}
            </div>
          )}
        </Mutation>
        <div className="pointer button" onClick={() => setLogin(!login)}>
          {login ? 'need to create an account?' : 'already have an account?'}
        </div>
      </div>
    </div>
  );
};

export default Login;
