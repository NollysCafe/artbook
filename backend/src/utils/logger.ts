export const log = {
	info: (...args: any[]) => console.log('🔵 [info]', ...args),
	warn: (...args: any[]) => console.warn('🟡 [warn]', ...args),
	error: (...args: any[]) => console.error('🔴 [error]', ...args),
	success: (...args: any[]) => console.log('🟢 [success]', ...args),
	debug: (...args: any[]) => console.debug('⚫ [debug]', ...args),
	verbose: (...args: any[]) => console.log('⚪ [verbose]', ...args),
}
