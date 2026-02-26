type HandleLogData = {
    type: 'handle' | 'auth' | 'fields' | 'global' | 'devolucionJob';
    message: string | undefined;
    stack?: string;
    name?: string;
    isWithRollBack: boolean;
    connection: string | null;
    commitController: boolean;
    errorRaw: any; 
};

export default HandleLogData
