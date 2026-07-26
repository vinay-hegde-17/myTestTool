const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER_ERROR: 500
};

const EMPLOYEE_ENDPOINTS = {

    LIST: '/employees',

    PROFILE_DETAILS: '/employees/profileDetails',

    EMPLOYEE_NAMES: '/employees/employeeNames',

    EMPLOYEES_FOR_ASSETS: '/employees/employeesForAssets',

    EMPLOYEE_ASSETS: '/employees/assets',

    TO_EDIT: '/employees/ToEdit',

    EMAIL_ID: '/employees/emailId',

    BY_ROLE: '/employees/ByRole',

    CHECK_EMAIL: '/employees/check-email',

    GET_NEW_JOINEES: '/employees/getNewJoinees',

    GET_LONG_SERVICE_EMP: '/employees/getLongServiceEmpList',

    HIERARCHY: '/employees',

    FETCH_FILE: '/employees/fetchFile',

    CREATE: '/employees',

    UPDATE: '/employees',

    UPDATE_ASSIGNED_IDS: '/employees/updateAssignedIds',

    UNASSIGN_ASSET: '/employees',

    REMOVE_PHOTO: '/employees'
};

module.exports = { HTTP_STATUS, EMPLOYEE_ENDPOINTS };