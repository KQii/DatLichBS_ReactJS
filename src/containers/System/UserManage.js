import React, { Component, Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { getAllUsers, createNewUserService, deleteUserService } from '../../services/userService';
import './UserManage.scss';
import ModalUser from './ModalUser';
import { emitter } from '../../utils/emitter';

class UserManage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            arrUsers: [],
            isOpenModalUser: false
        }
    }

    async componentDidMount() {
        await this.getAllUsersFromReact();
    }

    getAllUsersFromReact = async () => {
        let response = await getAllUsers('ALL');
        if (response && response.errCode === 0) {
            this.setState({
                arrUsers: response.users // hàm bất đồng bộ
            })
        }
    }

    handleAddNewUser = () => {
        this.setState({
            isOpenModalUser: true
        })
    }

    toggleUserModal = () => {
        this.setState({
            isOpenModalUser: !this.state.isOpenModalUser
        })
    }

    createNewUser = async (data) => {
        try {
            let response = await createNewUserService(data);
            if (response && response.errCode !== 0) {
                alert(response.errMessage);
            } else {
                await this.getAllUsersFromReact();
                this.toggleUserModal();

                emitter.emit('EVENT_CLEAR_MODAL_DATA');
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleDeleteUser = async (user) => {
        console.log('user id: ', user.id);
        console.log('type of user id: ', typeof (user.id));
        try {
            let response = await deleteUserService(user.id);
            if (response && response.errCode === 0) {
                await this.getAllUsersFromReact();
            } else {
                alert(response.errMessage);
            }
        } catch (e) {
            console.log(e);
        }
    }

    render() {
        let arrUsers = this.state.arrUsers;
        return (
            <div className="users-container">
                <ModalUser
                    isOpen={this.state.isOpenModalUser}
                    toggleFromParent={this.toggleUserModal}
                    createNewUser={this.createNewUser}
                ></ModalUser>
                <div className='title text-center mb-4'>Manage users</div>
                <div className='my-2 px-2'>
                    <button className='btn btn-primary px-2' onClick={() => { this.handleAddNewUser() }}>
                        <i class="fas fa-plus"></i> Add new user
                    </button>
                </div>
                <div className='users-table'>
                    <table class="table table-striped table-hover">
                        <thead className='table-success'>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Email</th>
                                <th scope="col">Firstname</th>
                                <th scope="col">Lastname</th>
                                <th scope="col">Address</th>
                                <th scope="col">Phonenumber</th>
                                <th scope="col">Gender</th>
                                <th scope="col">Image</th>
                                <th scope="col">RoleID</th>
                                <th scope="col">PositionID</th>
                                <th scope="col">Action</th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                arrUsers && arrUsers.map((item, index) => {
                                    return (
                                        <Fragment>
                                            <tr>
                                                <td>{index + 1}</td>
                                                <td>
                                                    {item.email}
                                                </td>
                                                <td>
                                                    {item.firstName}
                                                </td>
                                                <td>
                                                    {item.lastName}
                                                </td>
                                                <td>
                                                    {item.address}
                                                </td>
                                                <td>
                                                    {item.phonenumber}
                                                </td>
                                                <td>
                                                    {item.gender === 1 ? 'Male' : 'Female'}
                                                </td>
                                                <td>
                                                    {item.image}
                                                </td>
                                                <td>
                                                    {item.roleId}
                                                </td>
                                                <td>
                                                    {item.positionId}
                                                </td>
                                                <td>
                                                    <button className='btn-edit'><i className="far fa-edit"></i></button>
                                                    <button className='btn-delete' onClick={() => { this.handleDeleteUser(item) }}><i className="fas fa-trash-alt"></i></button>
                                                </td>
                                            </tr>
                                        </Fragment>
                                    )
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

}

const mapStateToProps = state => {
    return {
    };
};

const mapDispatchToProps = dispatch => {
    return {
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserManage);
