import Page from 'components/Page';
import React from 'react';
import {
    Badge,
    Button,
    ButtonGroup,
    Card,
    CardBody,
    CardHeader,
    Col,
    Form,
    Input,
    InputGroup,
    InputGroupAddon,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Row,
    Table,
} from 'reactstrap';
import { MdAutorenew, MdCheckCircle, MdEdit, MdHighlightOff, MdLoyalty, MdSearch } from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink';

import * as firebase from 'firebase/app';
import NestedCharacteristic from './NestedCharacteristic';

const perf = firebase.performance();

class CharacteristicPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            result: [],
            inputtedName: '',
            currentPage: 1,
            realCurrentPage: 1,
            todosPerPage: 5,
            maxPage: 1,
            flag: 0,
            keyword: '',
            active_user_id: "10",
            loading: false,
            checked: false,
            barcode: ""
        };
    }

    //set Current Limit
    handleSelect(event) {
        this.setState({ [event.target.name]: event.target.value, currentPage: 1, realCurrentPage: 1 }, () => {
            this.getListbyPaging(1, this.state.todosPerPage, this.state.keyword);
        });
    }


    //set Current Page
    paginationButton(event, flag, maxPage = 0) {
        var currPage = Number(event.target.value);
        if ((currPage + flag) > 0 && (currPage + flag) <= maxPage) {
            this.setState({
                currentPage: (currPage + flag),
                realCurrentPage: (currPage + flag)
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
    }

    enterPressedPage = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.state.currentPage > 0) {
                if (this.state.currentPage > this.state.maxPage) {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.maxPage,
                        currentPage : prevState.maxPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                } else {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.currentPage
                    }), () => this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword));
                }
            }
        }
    }

    enterPressedSearch = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            event.preventDefault();
            this.setState({ currentPage: 1, realCurrentPage: 1 }
                , () => { this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword); });
        }
    }

    showNotification = (currMessage, levelType) => {
        setTimeout(() => {
            if (!this.notificationSystem) {
                return;
            }
            this.notificationSystem.addNotification({
                title: <MdLoyalty />,
                message:
                    currMessage,
                level: levelType,
            });
        }, 300);
    }

    getListbyPaging(currPage, currLimit, kword) {
        const trace = perf.trace('getKarakterHdrList');
        trace.start();
        const urlA = myUrl.url_getKarakterHdrList;

        var payload = {
            offset: (currPage - 1) * currLimit,
            limit: currLimit,
            keyword: kword,
            token : window.localStorage.getItem('token'),
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }

        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                } else {
                    this.setState({ result: data, maxPage: data.page ? data.page : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            });
    }

    processKarakter = (param1, param2) => () => {

        const trace = perf.trace('processKarakter');
        trace.start();
        const urlA = myUrl.url_processKarakter;
        var headerPayload = {};
        if (param1 === "") {
            //UNTUK EDIT
            headerPayload = {
                hprodchar_id: this.state.editChar.hprodchar_id,
                hprodchar_name: this.state.editChar.hprodchar_name,
                hprodchar_userid: this.state.active_user_id
            };

        } else {
            //UNTUK INSERT
            headerPayload = {
                hprodchar_id: "",
                hprodchar_name: param1,
                hprodchar_userid: this.state.active_user_id
            };
        }

        var payload = {
            headers: headerPayload,
            details: param2,
            token : window.localStorage.getItem('token'),
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload.valueOf())
        }

        this.fetchData();
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json();

                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                this.setState({
                    loading: false,
                    modal_nested_parent: false,
                    modal_nested_parent_edit: false,
                    modal_nested: false,
                    modal_nested_edit: false,
                })
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                } else {
                    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((ERR) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => {
                this.setState(
                    {
                        loading: false
                    }
                );
            }
            );
    }

    componentDidMount() {
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }



    setKarakterActiveYN = (first_param, second_param) => () => {

        const trace = perf.trace('updateKarakterHdr');
        trace.start();
        var url = myUrl.url_updateKarakterHdr;
        this.fetchData();
        var payload = {
            id: second_param.hprodchar_id,
            activeyn: first_param,
            userid: this.state.active_user_id,
            token : window.localStorage.getItem('token'),
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
                    this.setState({
                        modal_active: false,
                        modal_deactive: false,
                        loading: false
                    });
                    return response.json()
                }
                else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => {
                this.setState(
                    {
                        loading: false
                    }
                );
            }
            );
    }

    //modal Tambah
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal Edit
    state = {
        modal_edit: false,
        modal_backdrop: false,
        modal_nested_parent_edit: false,
        modal_nested_edit: false,
        editChar: {},
    }

    //modal update YN
    state = {
        modal_active: false,
        modal_deactive: false,
        active_karaktercode_deactive: {},
        active_karaktercode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_karaktercode_deactive: todo,

        });
    }

    toggleActiveData = (todo) => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_karaktercode_active: todo,
        });
    }

    toggleEditData = (modalType, todo) => {
        if (!modalType) {
            const modal_edit = Object.assign({}, this.state.modal_edit);
            return this.setState({
                modal_edit: !modal_edit
            });
        }

        if (modalType === "nested_parent_edit") {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editChar: todo,
                checked: (todo.aktifyn === "Y") ? true : false,
            }, () => {
            });
        } else {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                editChar: todo,
            });
        }

    }

    toggle = modalType => () => {
        if (!modalType) {
            return this.setState({
                modal: !this.state.modal
            });
        }

        this.setState({
            [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

        });
    };

    fetchData = () => {
        this.setState({ loading: true });
    };

    handleClose = () => {
        this.setState({ checked: false });
    }


    setData = (data = null) => {
        if (data === null) {
            return "-";
        } else {
            return data;
        }
    }

    render() {
        const { loading } = this.state;
        const currentTodos = this.state.result.result;

        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>
                <th scope="row">{todo.hprodchar_id}</th>
                <td>{todo.hprodchar_name}</td>
                {todo.hprodchar_activeyn === "Y" &&
                    <td>
                        <Badge color="success" className="mr-1">Aktif</Badge>
                    </td>
                }
                {todo.hprodchar_activeyn !== "Y" &&
                    <td>
                        <Badge color="danger" className="mr-1">Tidak Aktif</Badge>
                    </td>
                }
                <td className="text-center">
                    <Button style={{ margin: "0px" }} color="secondary" size="sm" onClick={() => this.toggleEditData('nested_parent_edit', todo)}><MdEdit /></Button>
                </td>

                {todo.hprodchar_activeyn === "Y" &&
                    <td className="text-center">
                        <Button color="danger" size="sm" onClick={() => this.toggleDeactiveData({ ...todo })}><MdHighlightOff /></Button>
                    </td>
                }
                {todo.hprodchar_activeyn !== "Y" &&
                    <td className="text-center">
                        <Button color="success" size="sm" onClick={() => this.toggleActiveData({ ...todo })}><MdCheckCircle /></Button>
                    </td>
                }
            </tr>
        });

        return (
            <Page
                title="Karakteristik"
                breadcrumbs={[{ name: 'karakteristik', active: true }]}
                className="KarakteristikPage"
            >
                <Row>
                    <Col>
                        <Card className="mb-3">
                            <NotificationSystem
                                dismissible={false}
                                ref={notificationSystem =>
                                    (this.notificationSystem = notificationSystem)
                                }
                                style={NOTIFICATION_SYSTEM_STYLE}
                            />
                            <CardHeader className="d-flex justify-content-between">
                                <Form inline className="cr-search-form" onSubmit={e => e.preventDefault()}>
                                    <MdSearch
                                        size="20"
                                        className="cr-search-form__icon-search text-secondary"
                                    />
                                    <Input
                                        type="search"
                                        className="cr-search-form__input"
                                        placeholder="Search..."
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={event => this.enterPressedSearch(event, true)}
                                        
                                    />
                                </Form>

                                {/* Modal Tambah */}
                                <Button size="sm" onClick={this.toggle('nested_parent')}>Tambah</Button>
                                {this.state.modal_nested_parent &&
                                    <NestedCharacteristic
                                        toggleParent={this.toggle('nested_parent')}
                                        show={this.state.modal_nested_parent}
                                        judul={"TAMBAH"}
                                        showNotification={this.showNotification}

                                        handleClose={this.handleClose}
                                        showChild={this.state.modal_nested}
                                        toggleChild={this.toggle('nested')}
                                        processKarakter={this.processKarakter}
                                        loading={this.state.loading}

                                        userid={this.state.active_user_id}
                                    />
                                }

                                {/* Modal Edit */}
                                {this.state.modal_nested_parent_edit &&
                                    <NestedCharacteristic
                                        toggleParent={this.toggle('nested_parent_edit')}
                                        show={this.state.modal_nested_parent_edit}
                                        currentChar={this.state.editChar}
                                        showNotification={this.showNotification}
                                        judul={"EDIT"}

                                        handleClose={this.handleClose}
                                        showChild={this.state.modal_nested_edit}
                                        toggleChild={this.toggle('nested_edit')}
                                        processKarakter={this.processKarakter}


                                        userid={this.state.active_user_id}
                                    />}


                                {/* Modal Aktif no Aktif  */}
                                <Modal
                                    isOpen={this.state.modal_deactive}>
                                    <ModalHeader toggle={this.toggle('deactive')}>
                                        Konfirmasi Penonaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>ID Karakteristik: {this.state.active_karaktercode_deactive && this.state.active_karaktercode_deactive.hprodchar_id}</strong>
                                        <br></br>
                                        <strong>Nama: {this.state.active_karaktercode_deactive && this.state.active_karaktercode_deactive.hprodchar_name} </strong>
                                        <br></br>
                                        <br></br>
                                        Apakah Anda yakin ingin menonaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setKarakterActiveYN('N', this.state.active_karaktercode_deactive)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                                <Modal
                                    onExit={() => this.handleClose}
                                    isOpen={this.state.modal_active}>
                                    <ModalHeader >
                                        Konfirmasi Pengaktifan
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>ID Karakteristik: {this.state.active_karaktercode_active && this.state.active_karaktercode_active.hprodchar_id}</strong>
                                        <br></br>
                                        <strong>Nama: {this.state.active_karaktercode_active && this.state.active_karaktercode_active.hprodchar_name} </strong>
                                        <br></br>
                                        <br></br>
                                        Apakah Anda yakin ingin mengaktifkan data ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={this.setKarakterActiveYN('Y', this.state.active_karaktercode_active)} disabled={loading}>
                                            {!loading && <span>Ya</span>}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && <span>Sedang diproses</span>}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('active')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                    striped>
                                    <thead>
                                        <tr className="text-right" >
                                            <td colSpan='11' style={{ border: 'none' }}>{'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</td>
                                        </tr>
                                        <tr>
                                            <th>ID</th>
                                            <th>Nama</th>
                                            <th>Status</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                        {!currentTodos && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='11' className="text-center">TIDAK ADA DATA</td>
                                        </tr>}
                                    </tbody>
                                </Table>
                            </CardBody>
                            <CardBody>
                                <Row>
                                    <Col md="9" sm="12" xs="12">
                                        <InputGroup>
                                            <InputGroupAddon addonType="prepend">Tampilkan</InputGroupAddon>
                                            <select
                                                name="todosPerPage"
                                                style={{ height: '38px' }}
                                                value={this.state.value}
                                                onChange={(e) => this.handleSelect(e)}>
                                                <option value="5">5</option>
                                                <option value="10">10</option>
                                                <option value="20">20</option>
                                            </select>
                                            <InputGroupAddon addonType="prepend">Baris Per-Halaman</InputGroupAddon>
                                        </InputGroup>
                                    </Col>
                                    <Col md="3" sm="12" xs="12">
                                        <Card className="mb-3s">
                                            <ButtonGroup >
                                                <Button
                                                    name="FirstButton"
                                                    value={1}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10092;&#10092;
                                       </Button>
                                                <Button
                                                    name="PrevButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, -1, this.state.maxPage)}>
                                                    &#10092;
                                       </Button>
                                                <input
                                                    type="text"
                                                    placeholder="Page"
                                                    outline='none'
                                                    value={this.state.currentPage}
                                                    onChange={(e) => this.setState({ currentPage: e.target.value })}
                                                    onKeyPress={(e) => this.enterPressedPage(e)}
                                                    style={{ height: '38px', width: '75px', textAlign: 'center' }}
                                                />
                                                <Button
                                                    name="NextButton"
                                                    value={this.state.currentPage}
                                                    onClick={(e) => this.paginationButton(e, 1, this.state.maxPage)}>
                                                    &#10093;
                                       </Button>
                                                <Button
                                                    name="LastButton"
                                                    value={this.state.maxPage}
                                                    onClick={(e) => this.paginationButton(e, 0, this.state.maxPage)}>
                                                    &#10093;&#10093;
                                       </Button>
                                            </ButtonGroup>
                                        </Card>
                                    </Col>
                                </Row>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Page>
        );
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default CharacteristicPage;