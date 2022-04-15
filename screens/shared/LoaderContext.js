import React from 'react';
import Loader from './Loader';
import * as Constant from '../../shared/constants';
const LoaderContext = React.createContext({});

export default class LoaderContextProvider extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            loading: false,
            message: "",
            opacity: Constant.loaderOpacity
        }
    }
    showLoader = (txt = "",transparent=Constant.loaderOpacity) => this.setState({ loading: true , message:txt , opacity:transparent})
    hideLoader = () => this.setState({ loading: false, message:""})
   
    render() {
    const { loading , message,opacity } = this.state
    
    const funcs = {
        showLoader: this.showLoader,
        hideLoader: this.hideLoader
    }

    return (
        <LoaderContext.Provider value={funcs}>
            {this.props.children}
            <Loader toggleLoader={loading} message={message} opacity={opacity}/>
        </LoaderContext.Provider>
        )
    }
}

export const LoaderContextConsumer = ChildComponent => props => (
    <LoaderContext.Consumer>
      {
        funcs => <ChildComponent {...props} LoadingService ={funcs} />
      }
    </LoaderContext.Consumer>
  );
  