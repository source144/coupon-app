import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';
import Spinner from '../../components/UI/Spinner/Spinner';
import Aux from '../../hoc/Aux';

import DateIcon from '@material-ui/icons/DateRange';
import DescriptionIcon from '@material-ui/icons/Description';
import ImageIcon from '@material-ui/icons/Image';

import CouponEditForm from '../../components/Cards/CouponEditFrom/CouponEditForm';
import CouponDeleteForm from '../../components/Cards/CouponDeleteForm/CouponDeleteForm';

import * as actions from '../../store/actions/actions';
import * as userTypes from '../../store/userTypes';
import * as utils from '../../store/util';

class UserCoupons extends Component {
    state = {
        formCoupon: null,
        isOpen: false,
        isEdit: false,
        collapsed: null
    }

    componentWillMount() {
        const { onCouponsMount, auth } = this.props;

        onCouponsMount(auth);
    }


    // collapse
    handleClick = (e, id) => {
        e.preventDefault();
        this.setState({ collapsed: this.state.collapsed === id ? null : id });
    }

    handleEdit = coupon => this.setState({ isEdit: true, isOpen: true, formCoupon: coupon });
    handleEditClose = () => this.setState({ isOpen: false, formCoupon: null });
    handleEditSave = coupon => this.props.onCouponEdit(this.props.auth, coupon);

    handleRemove = coupon => this.setState({ isEdit: false, isOpen: true, formCoupon: coupon });
    handleRemoveClose = () => this.setState({ isOpen: false, formCoupon: null });
    handleRemoveConfirm = coupon => this.props.onCouponDelete(this.props.auth, coupon);
    render() {
        const { coupons, loading, error, auth } = this.props,
            { collapsed } = this.state;
        let isCompany = false;


        if (auth) {
            if (auth.type === userTypes.COMPANY)
                isCompany = true;
        }
        let count = 0;

        const comanyListItems = (loading || error) || !coupons ? null : coupons.map(c => (
            <Aux key={c.id + '_' + utils.uuid()}>
                <ListItem component={Link} to={'/company/' + c.id} button divider={++count < coupons.length} onClick={e => this.handleClick(e, c.id)}>
                    <ListItemAvatar>
                        <Avatar style={{ backgroundColor: utils.stringToColor(c.title) }}>{c.title ? c.title[0].toUpperCase() : null}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={c.title}
                        secondary={c.type}
                    />
                    {/* <ListItemText inset primary="inline text" /> */}
                    <ListItemSecondaryAction>
                        <IconButton aria-label="Edit" onClick={() => this.handleEdit(c)} disabled={!isCompany}>
                            <EditIcon />
                        </IconButton>
                        <IconButton aria-label="Delete" onClick={() => this.handleRemove(c)} disabled={!isCompany}>
                            <DeleteIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem >
            </Aux>
        ));
        return (
            <div className={classes.Container} >
                <h1 style={{ textAlign: 'center' }}>All Companies</h1>
                {error ? <h5>{error}</h5> : null}
                {loading ? <Spinner /> :
                    <Aux>
                        <List component="nav">
                            {comanyListItems}
                        </List>
                        {!this.state.isOpen ? null :
                            this.state.isEdit ?
                                <CouponEditForm
                                    coupon={{ ...this.state.formCoupon, startDate: moment(this.state.formCoupon.startDate), endDate: moment(this.state.formCoupon.endDate) }}
                                    handleSave={this.handleEditSave}
                                    handleClose={this.handleEditClose}
                                    loading={this.props.editing}
                                    error={this.props.editError}
                                />
                                : // (REMOVE FORM)
                                <CouponDeleteForm
                                    coupon={this.state.formCoupon}
                                    handleDelete={this.handleRemoveConfirm}
                                    handleClose={this.handleRemoveClose}
                                    loading={this.props.deleting}
                                    error={this.props.deleteError}
                                />
                        }

                    </Aux>
                }

            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        coupons: state.myCoupons.coupons,
        error: state.myCoupons.error,
        loading: state.myCoupons.loading,
        catagories: state.catagories,
        deleteError: state.myCoupons.deleteError,
        editError: state.myCoupons.editError,
        deleting: state.myCoupons.deleting,
        editing: state.myCoupons.editing,
        auth: state.auth.user
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onCouponsMount: (authData) => dispatch(actions.loadMyCoupons(authData)),
        onCouponEdit: (authData, coupon) => dispatch(actions.editMyCoupon(authData, coupon)),
        onCouponDelete: (authData, coupon) => dispatch(actions.deleteMyCoupon(authData, coupon))
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserCoupons);