import React, { Component } from 'react';

import classes from './Modal.css';
import Aux from '../../../hoc/Aux';
import Backdrop from '../Backdrop/Backdrop';

class Modal extends Component {

    shouldComponentUpdate(nextProps, nextState) {
            return nextProps.show !== this.props.show || nextProps.children !== this.props.children;
    }

    render() {
        return (
            <Aux>
                <Backdrop show={this.props.show} close={this.props.closeModal} />
                <div
                    className={classes.Modal}
                    onKeyPress={this.props.keyPressed}
                    style={this.props.show ?
                        { transform: 'translateY(0)', opacity: 1 } :
                        { transform: 'translateY(-100vh)', opacity: '0' }
                    }>
                    {this.props.children}
                </div>
            </Aux>
        );
    }
}

export default Modal;