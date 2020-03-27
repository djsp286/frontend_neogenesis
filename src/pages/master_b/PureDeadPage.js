import Page from 'components/Page';
import React from 'react';
import {
    Button, Card, CardBody, CardHeader, Col, Row, Table, Modal,
    ModalBody, ModalFooter, ModalHeader, Input, ButtonGroup, InputGroup, Label,
    InputGroupAddon, Form,
} from 'reactstrap';
import { MdSearch, MdAutorenew, MdDelete } from 'react-icons/md';


import {
    MdLoyalty,
} from 'react-icons/md';
import NotificationSystem from 'react-notification-system';
import { NOTIFICATION_SYSTEM_STYLE } from 'utils/constants';
import * as myUrl from '../urlLink'

import * as firebase from 'firebase/app';
import NestedPureDead from './NestedPureDead';

const perf = firebase.performance();

class DepartmentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: [],
            currentDepart: { dept_name: '', dept_kosmetikyn: "N", dept_lokasi: 0 },
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
            enterButton: false
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

    pagination = (value, arrow, maxPage = 0) => {
        var currPage = Number(value);
        if ((currPage + arrow) > 0 && (currPage + arrow) <= maxPage) {
            this.setState({
                currentPage: (currPage + arrow),
                realCurrentPage: (currPage + arrow),
            }, () => {
                this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
            });
        }
        console.log("YES BISA");

    }

    enterPressedPage = (event) => {
        var code = event.keyCode || event.which;
        if (code === 13) {
            if (this.state.currentPage > 0) {
                if (this.state.currentPage > this.state.maxPage) {
                    this.setState(prevState => ({
                        realCurrentPage: prevState.maxPage,
                        currentPage: prevState.maxPage
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
        const trace = perf.trace('getProdPureDeadList');
        trace.start();
        const urlA = myUrl.url_getProdPureDeadList;

        var payload = {
            offset: (currPage - 1) * currLimit,
            limit: currLimit,
            keyword: kword,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

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
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.setState({ result: data, maxPage: data.page ? data.page : 1, loading: false });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            });
    }


    componentDidMount() {
        this.getListbyPaging(this.state.currentPage, this.state.todosPerPage);
    }

    insertMasterPD = param => () => {
        const trace = perf.trace('newDProdPureDead');
        trace.start();
        var url = myUrl.url_newDProdPureDead;
        this.fetchData();
        var payload = {
            lpbh_userid: this.state.active_user_id,
        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false }) });
    }

    insertMasterPDShortcut = param => {
        const trace = perf.trace('newDProdPureDead');
        trace.start();
        var url = myUrl.url_newDProdPureDead;
        this.setState({ enterButton: true })
        this.fetchData();
        var payload = {
            lpbh_userid: this.state.active_user_id,
        };

        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_nested: false,
                        modal_nested_parent: false,
                        inputtedName: '',
                        checked: false,
                        loading: false,
                        enterButton: false
                    });
                    return response.json()
                } else {
                    this.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false, enterButton: false }) });
    }

    deletePd = (first_param, second_param) => {
        const trace = perf.trace('deactivateProdPureDeadByProcod');
        trace.start();
        var url = myUrl.url_deactivateProdPureDeadByProcod;
        this.fetchData();
        var payload = {
            lpbd_tglrip: second_param.lpbd_tglrip,
            lpbd_userid: second_param.lpbd_userid,
            lpbd_procod: second_param.lpbd_procod,
            lpbd_nomor: second_param.lpbd_nomor,
            lpbd_dataaktifyn: first_param,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();

                if (response.ok) {
                    this.componentDidMount();
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
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false }) })
            ;
    }

    deleteAllPd = (first_param) => {
        const trace = perf.trace('deactivateProdPureDeadAll');
        trace.start();
        var url = myUrl.url_deactivateProdPureDeadAll;
        this.fetchData();
        var payload = {
            lpbd_userid: first_param,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload)
        }
        fetch(url, option)
            .then(response => {
                trace.stop();

                if (response.ok) {
                    this.componentDidMount();
                    this.setState({
                        modal_delete: false,
                        modal_backdrop_delete: false,
                        modal_nested_parent_delete: false,
                        modal_nested_delete: false,
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
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.showNotification(data.responseDescription, 'info');
                    this.setState({ result: [] });
                }
            }).catch((err) => {
                this.showNotification("Koneksi ke server gagal!", 'error');
            }).then(() => { this.setState({ loading: false }) })
            ;
    }
    //modal Tambah
    state = {
        modal: false,
        modal_backdrop: false,
        modal_nested_parent: false,
        modal_nested: false,
        backdrop: true,
    };

    //modal Delete All
    state = {
        modal_delete: false,
        modal_backdrop_delete: false,
        modal_nested_parent_delete: false,
        modal_nested_delete: false,
        active_pdallcode_deactive: {},
    }

    //modal Delete
    state = {
        modal_active: false,
        modal_deactive: false,
        active_pdcode_deactive: {},
        active_pdcode_active: {},
        modal_active_toggle: "",
        modal_deactive_toggle: "",
    };

    toggleDeactiveData = (todo) => {
        this.setState({
            modal_deactive_toggle: "deactive_toggle",
            modal_deactive: true,
            active_pdcode_deactive: todo,
            active_pdallcode_deactive: todo,
        });
    }

    toggleActiveData = (todo) => {
        this.setState({
            modal_active_toggle: "active_toggle",
            modal_active: true,
            active_pdcode_active: todo,
        });
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

    processInsertPD = (param1, param2) => () => {
        const trace = perf.trace('newDProdPureDead');
        trace.start();
        const urlA = myUrl.url_newDProdPureDead;
        var headerPayload = {
            lpbd_procod: param1,
            lpbh_userid: this.state.active_user_id
        };

        var payload = {
            headers: headerPayload,
            details: param2,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload.valueOf())
        }
        this.fetchData();
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                this.setState({
                    loading: false,
                    modal_statusData: false,
                    modal_nested: false,
                    modal_nested_edit: false,
                    modal_nested_parent: false,
                    modal_nested_parent_edit: false
                });
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
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

    processInsertPDShortcut = (param1, param2) => {
        const trace = perf.trace('newDProdPureDead');
        trace.start();
        const urlA = myUrl.url_newDProdPureDead;
        var headerPayload = {
            lpbd_procod: param1,
            lpbh_userid: this.state.active_user_id
        };

        var payload = {
            headers: headerPayload,
            details: param2,
        };
        const option = {
            method: "POST",
            json: true,
            headers: {
                "Content-Type": "application/json;charset=UTF-8",
                "Authorization": window.localStorage.getItem('tokenLogin')

            },
            body: JSON.stringify(payload.valueOf())
        }
        this.fetchData();
        fetch(urlA, option)
            .then(response => {
                trace.stop();
                if (response.ok) {
                    return response.json()
                } else {
                    this.props.showNotification("Koneksi ke server gagal!", 'error');
                }
            }).then(data => {
                this.setState({
                    loading: false,
                    modal_statusData: false,
                    modal_nested: false,
                    modal_nested_edit: false,
                    modal_nested_parent: false,
                    modal_nested_parent_edit: false
                });
                if (data.responseMessage === "FALSE") {
                    this.showNotification(data.responseDescription, 'error');
                    if(data.responseDescription.toLowerCase().includes("expired")){
                        window.localStorage.removeItem('tokenLogin');
                        window.localStorage.removeItem('accessList');
                        this.props.history.push({
                            pathname: '/login',
                          })
                    }

                } else {
                    this.getListbyPaging(this.state.currentPage, this.state.todosPerPage, this.state.keyword);
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


    testFunc = (modalType) => {
        if (this.state.modal_nested_parent && this.state.modal_nested) {
            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],
                modal_nested: false
            });
        } else {
            if (!modalType) {
                return this.setState({
                    modal: !this.state.modal
                });
            }

            this.setState({
                [`modal_${modalType}`]: !this.state[`modal_${modalType}`],

            });
        }
    }

    render() {
        const { loading } = this.state;

        var currentTodos = this.state.result.result;
        const isEnabled = currentTodos ? true : false;
        const renderTodos = currentTodos && currentTodos.map((todo, i) => {
            return <tr key={i}>

                <td>{todo.lpbd_procod}</td>
                {
                    <td>
                        {todo.lpbd_description}
                    </td>
                }
                {
                    <td>
                        {todo.lpbd_tglrip}
                    </td>
                }
                {todo.lpbd_dataaktifyn === "Y" &&
                    <td className="text-center">
                        <Button color="danger" size="sm" onClick={() => this.toggleDeactiveData(todo)}><MdDelete /></Button>
                    </td>
                }

            </tr>
        });

        return (
            <Page
                title="Pure Dead Produk"
                breadcrumbs={[{ name: 'puredead', active: true }]}
                className="PureDeadPage"
            >
                <script>
                    {document.onkeydown = (e) => {
                        var currentTodos = this.state.result.result;
                        const isEnabled = currentTodos ? true : false;
                        e = e || window.event;
                        if (e.ctrlKey) {
                            switch (e.key) {
                                //ctrl+s untuk modal simpan
                                case "s":

                                    if (this.state.modal_nested_parent) {
                                        this.testFunc("nested");
                                        console.log("asdasd")
                                    }
                                    console.log(this.state.modal)
                                    console.log("dasdad")
                                    e.preventDefault();
                                    break;

                                case "S":
                                    // 
                                    if (this.state.modal_nested_parent) {
                                        this.testFunc("nested");
                                    }
                                    e.preventDefault();
                                    break;

                                //ctrl + kanan untuk last
                                case "ArrowRight":
                                    this.pagination(this.state.maxPage, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;

                                //ctrl + kiri untuk first
                                case "ArrowLeft":
                                    this.pagination(1, 0, this.state.maxPage);
                                    e.preventDefault();
                                    break;
                            }
                        }
                        switch (e.key) {
                            case "Enter":
                                if (this.state.modal_nested === true && this.state.enterButton === false) { this.processInsertPDShortcut() }
                                // e.preventDefault();
                                break;
                            // f1
                            case "F1":
                                this.testFunc("nested_parent");
                                console.log(this.state.modal_nested_parent);
                                // document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //f3
                            case "F3":
                                // alert("untuk search");
                                document.getElementById("search").focus();
                                e.preventDefault();
                                break;

                            //f9
                            case "F9":
                                if (isEnabled === true) { this.testFunc("nested_parent_delete"); }
                                console.log(this.state.modal_nested_parent_delete);
                                // document.getElementById("unit").focus();
                                e.preventDefault();
                                break;

                            //kanan untuk next
                            case "ArrowRight":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, 1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;

                            //kiri untuk prev
                            case "ArrowLeft":
                                if (e.ctrlKey === false) {
                                    this.pagination(this.state.currentPage, -1, this.state.maxPage);
                                }
                                e.preventDefault();
                                break;


                        }
                        //menghilangkan fungsi default tombol
                        // e.preventDefault();
                    }}
                </script>
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
                                        id="search"
                                        onChange={evt => this.updateSearchValue(evt)}
                                        onKeyPress={event => this.enterPressedSearch(event, true)}
                                    />
                                </Form>
                                <Col style={{ paddingRight: '30px' }}></Col>

                                {/* Modal + Button Tambah */}
                                <Button size="sm" style={{ marginRight: '15px' }} onClick={this.toggle('nested_parent')}>Tambah</Button>
                                {this.state.modal_nested_parent &&
                                    <NestedPureDead
                                        toggleParent={this.toggle('nested_parent')}
                                        show={this.state.modal_nested_parent}
                                        judul={"Tambah Pure Dead Produk"}
                                        showNotification={this.showNotification}

                                        handleClose={this.handleClose}
                                        showChild={this.state.modal_nested}
                                        toggleChild={this.toggle('nested')}
                                        processInsertPD={this.processInsertPD}
                                        loading={this.state.loading}


                                        userid={this.state.active_user_id}
                                    />}

                                {/* Modal Hapus Semua */}
                                <Button disabled={!isEnabled} size="sm" color="danger" onClick={this.toggle('nested_parent_delete')}>Hapus Semua</Button>
                                <Modal
                                    onExit={this.handleClose}
                                    isOpen={this.state.modal_nested_parent_delete}
                                    toggle={this.toggle('nested_parent_delete')}
                                    className={this.props.className}>
                                    <ModalHeader toggle={this.toggle('nested_parent_delete')}>
                                        Hapus Semua Data
                                    </ModalHeader>
                                    <ModalBody>
                                        <Label>Apakah Anda yakin untuk menghapus semua Data?</Label>
                                        <ModalFooter>
                                            <Button color="danger" onClick={(e) => this.deleteAllPd('N', this.state.active_pdallcode_deactive)} disabled={loading}>
                                                {!loading && "Hapus Semua"}
                                                {loading && (
                                                    <MdAutorenew />
                                                )}
                                                {loading && "Sedang diproses"}
                                            </Button>
                                            {!loading && <Button
                                                color="secondary"
                                                onClick={this.toggle('nested_parent_delete')}>
                                                Tidak
                                                </Button>}
                                        </ModalFooter>
                                    </ModalBody>
                                </Modal>

                                {/* Modal untuk Hapus */}
                                <Modal
                                    isOpen={this.state.modal_deactive}
                                    toggle={this.toggle('deactive')}>
                                    <ModalHeader toggle={this.toggle('deactive')}>
                                        Konfirmasi Penghapusan Produk
                                    </ModalHeader>
                                    <ModalBody>
                                        <strong>Nomor: {this.state.active_pdcode_deactive && this.state.active_pdcode_deactive.lpbd_nomor}</strong>
                                        <br />
                                        <strong>Procod: {this.state.active_pdcode_deactive && this.state.active_pdcode_deactive.lpbd_procod}</strong>
                                        <br />
                                        <strong>Tanggal RIP: {this.state.active_pdcode_deactive && this.state.active_pdcode_deactive.lpbd_tglrip}</strong>
                                        <br></br>
                                        <br></br>
                                        Apakah Anda yakin ingin menghapus Produk ini?
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button color="primary" onClick={(e) => this.deletePd('N', this.state.active_pdcode_deactive)} disabled={loading}>
                                            {!loading && "Ya"}
                                            {loading && (
                                                <MdAutorenew />
                                            )}
                                            {loading && "Sedang diproses"}
                                        </Button>{' '}
                                        {!loading && <Button color="secondary" onClick={this.toggle('deactive')}>
                                            Tidak
                                        </Button>}
                                    </ModalFooter>
                                </Modal>
                            </CardHeader>
                            <CardBody>
                                <Table responsive
                                    striped>
                                    <thead>
                                        <tr>
                                            <td colSpan='8' className="text-right" style={{ border: 'none' }}>
                                                <Label style={{ width: '50%', textAlign: 'left' }}>F1: Tambah, F3: Search, F9: Hapus Semua</Label>
                                                <Label style={{ width: '50%', textAlign: 'right' }}> {'Halaman : ' + this.state.realCurrentPage + ' / ' + this.state.maxPage}</Label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>Procod</th>
                                            <th>Deskripsi Produk</th>
                                            <th>Tanggal RIP</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderTodos}
                                        {!currentTodos && <tr>
                                            <td style={{ backgroundColor: 'white' }} colSpan='6' className="text-center">TIDAK ADA DATA</td>
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

    updateInputValue(evt, field) {
        let currentDepart = this.state.currentDepart;
        currentDepart[field] = evt.target.value;
        this.setState({ currentDepart });
    }

    updateSearchValue(evt) {
        this.setState({
            keyword: evt.target.value
        });
    }
}
export default DepartmentPage;