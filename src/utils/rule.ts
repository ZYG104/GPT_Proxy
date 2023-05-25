export const rule = {
    required: (value: any) => {
        return (value && !!value.trim()) || '必填项不能为空';
    }
}