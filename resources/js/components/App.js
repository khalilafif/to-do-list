import React from 'react';
import { HashRouter, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { Nav, NavItem } from 'reactstrap';
import Login from './Login';
import Todolist from './Todolist';

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			token: null
		};
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.refresh = this.refresh.bind(this);
	}

	componentWillMount() {
		const lsToken = localStorage.getItem('access_token'); 
		if (lsToken && lsToken !== 'undefined') {
			this.authenticate(lsToken);
		}else{
			this.setState({
				isAuthenticated: false,
				token: null
			});
		}
	}

	authenticate(token) {
		this.setState({
			isAuthenticated: true,
			token: token
		});
		localStorage.setItem('access_token', token);
	}

	logout() {
		return axios.get('/api/auth/logout', {
			headers: { 'Authorization': 'Bearer ' + this.state.token }
		})
		.then((response) => {
			this.setState({
				isAuthenticated: false,
				token: null
			});
		})
		
	}

	refresh() {
		return axios.get('/api/auth/refresh', {
			headers: { 'Authorization': 'Bearer ' + this.state.token }
		})
		.then((response) => {
			const token = response.data.token;
			this.authenticate(token);
			if(response.data.message && response.data.message==Unauthenticated)
				this.setState({
					isAuthenticated: false,
					token: null
				});
		})
		.catch((error) => {
			console.log('Error!', error);
		});
	}

	render() {
		return (
			<HashRouter>
				<div>
					<Menu isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
					<Switch>						
						<Route exact path='/login' render={(props) => <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />						
						<PrivateRoute exact path='/' component={Todolist} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
					</Switch>
				</div>
			</HashRouter>
		);
	}
}
const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
	<Route {...rest} render={props => (
		isAuthenticated ? (
			<Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
		) : (
			<Redirect to={{
				pathname: '/login',
				state: { from: props.location }
			}} />
		)
	)} />
);

const Menu = (props) => (
	<ul className="list-inline">
		{props.isAuthenticated ?
			<li>
				<a href="#" onClick={props.logout}>
					Logout
				</a>
			</li>
			:null	
		}
		{props.isAuthenticated ?
		<li>
			<NavLink exact activeClassName="active" to="/">
				To Do List
			</NavLink>
		</li>
		:null	
		}
		{!props.isAuthenticated ?
		<li>
			<NavLink exact activeClassName="active" to="/login">
				Login
			</NavLink>
		</li>
		:null	
	}		
	</ul>
);

export default App;